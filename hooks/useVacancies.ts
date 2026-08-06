import { useState, useEffect, useMemo, useCallback } from 'react';
import { Vacancy } from '@/types/vacancy';

// Строгая типизация системных ошибок UI для безопасной обработки на фронтенде
type FetchError = {
    type: 'network' | 'server';
    message: string;
} | null;

/**
 * Парсит строковую дату формата "ДД.ММ.ГГГГ" в объект Date.
 * Вынесена за пределы компонента, так как является чистой функцией
 * и не требует пересоздания при каждом рендере (оптимизация памяти).
 */
const parseDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const [day, month, year] = dateStr.split('.');
    // Месяцы в JS начинаются с 0, поэтому вычитаем 1
    return new Date(Number(year), Number(month) - 1, Number(day));
};

/**
 * Предотвращает падение сортировки, если зарплата не указана.
 * Возвращает 0 в качестве дефолтного значения для корректного математического сравнения.
 */
const parseSalary = (salary: number | null | undefined): number => {
    return salary ?? 0;
};

/**
 * Custom Hook: Изолирует всю бизнес-логику управления вакансиями.
 * Реализует паттерны: Разделение ответственности (SoC), отмену race conditions и кэш-контроль.
 */
export function useVacancies() {
    // Хранилище сырых данных, полученных с бэкенда
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    // Флаг состояния загрузки для отображения скелетонов/лоадеров
    const [loading, setLoading] = useState(true);
    // Типизированный стейт ошибки (сеть или сбой сервера)
    const [error, setError] = useState<FetchError>(null);
    // Стейт текущей сортировки (по умолчанию: от новых к старым)
    const [sortBy, setSortBy] = useState<'date' | 'salary-asc' | 'salary-desc'>('date');

    /**
     * Стабильная функция запроса данных. Обернута в useCallback,
     * чтобы ссылка на неё не менялась при рендерах, предотвращая бесконечные циклы в useEffect.
     * Принимает AbortSignal для принудительной отмены подвисших запросов.
     */
    const fetchVacancies = useCallback(async (signal: AbortSignal) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/vacancies', { signal });

            // Если сервер ответил ошибкой (например, 500 или 404), генерируем исключение
            if (!res.ok) throw new Error(`Server status ${res.status}`);

            const data: Vacancy[] = await res.json();
            setVacancies(data);
        } catch (err) {
            // Если запрос отменен через AbortController, прерываем выполнение.
            // Это предотвращает race conditions, когда старый медленный запрос перезаписывает новый.
            if (err instanceof Error && err.name === 'AbortError') return;

            console.error('Ошибка загрузки вакансий:', err);

            // Дифференцируем ошибку: проверяем физический онлайн-статус браузера пользователя
            if (!navigator.onLine) {
                setError({
                    type: 'network',
                    message: 'Проверьте подключение к интернету и повторите попытку.'
                });
            } else {
                setError({
                    type: 'server',
                    message: 'Не удалось загрузить данные. Сервер временно недоступен.'
                });
            }
        } finally {
            // Блок выполняется всегда, гарантируя скрытие лоадера в любом исходе
            setLoading(false);
        }
    }, []);

    /**
     * Эффект первичного монтирования. Запускает сетевой запрос.
     * Функция очистки (cleanup) автоматически отменяет запрос, если пользователь ушел со страницы.
     */
    useEffect(() => {
        const controller = new AbortController();
        // Явно сообщаем компилятору, что Promise контролируется внутри самой функции
        void fetchVacancies(controller.signal);

        return () => controller.abort();
    }, [fetchVacancies]);

    /**
     * Публичный метод для ручного повтора запроса при сбоях (Паттерн "Retry Pattern")
     */
    const handleRetry = () => {
        const controller = new AbortController();
        void fetchVacancies(controller.signal);
    };

    /**
     * Оптимизация: Сортировка массива на лету (On-the-fly Sorting).
     * useMemo предотвращает повторную сортировку при любых перерендерах UI (например, при открытии модалки).
     * Сортировка сработает ТОЛЬКО если изменился массив вакансий или тип сортировки.
     */
    const processedVacancies = useMemo(() => {
        const sorted = [...vacancies]; // Создаем копию, так как .sort() мутирует исходный массив
        switch (sortBy) {
            case 'date':
                return sorted.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
            case 'salary-asc':
                return sorted.sort((a, b) => parseSalary(a.salary) - parseSalary(b.salary));
            case 'salary-desc':
                return sorted.sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
            default:
                return sorted;
        }
    }, [vacancies, sortBy]);

    // Возвращаем строго контролируемый интерфейс наружу для использования в JSX компонентах
    return {
        vacancies: processedVacancies,
        loading,
        error,
        sortBy,
        setSortBy,
        handleRetry
    };
}
