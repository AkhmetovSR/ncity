// app/vacancy/_hooks/useVacancies.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Vacancy } from '@/types/vacancy';
import { useVacancyContext } from '@/app/vacancy/_context/VacancyContext';

type FetchError = {
    type: 'network' | 'server';
    message: string;
} | null;

const parseDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const [day, month, year] = dateStr.split('.');
    return new Date(Number(year), Number(month) - 1, Number(day));
};

export function useVacancies() {
    const { vacancies, setVacancies, hasLoadedOnce, setHasLoadedOnce } = useVacancyContext();

    const [loading, setLoading] = useState(!hasLoadedOnce);
    // Флаг загрузки именно СЛЕДУЮЩЕЙ порции (чтобы не показывать главный скелетон)
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<FetchError>(null);
    const [sortBy, setSortBy] = useState<'date' | 'salary-asc' | 'salary-desc'>('date');
    // Флаг, что в базе больше нет вакансий (чтобы зря не слать запросы)
    const [hasMore, setHasMore] = useState(true);

    const LIMIT = 50;

    /**
     * Основная функция запроса.
     * @param isInitial - истина, если это самый первый заход на страницу
     */
    const fetchVacancies = useCallback(async (signal: AbortSignal, isInitial = false) => {
        // Вычисляем offset на основе текущего количества вакансий на "складе"
        // Если это первичный SWR-запрос фона при возврате на страницу, offset = 0
        const currentOffset = isInitial ? 0 : vacancies.length;

        if (isInitial && !hasLoadedOnce) {
            setLoading(true);
        } else if (!isInitial) {
            setLoadingMore(true);
        }

        if (error !== null) {
            setError(null);
        }

        try {
            // Стучимся в наш новый эндпоинт внутри папки vacancy
            const res = await fetch(`/vacancy/api?limit=${LIMIT}&offset=${currentOffset}`, { signal });
            if (!res.ok) throw new Error(`Server status ${res.status}`);

            const newData: Vacancy[] = await res.json();

            if (newData.length < LIMIT) {
                setHasMore(false); // Если пришло меньше 50, значит БД опустела
            }

            setVacancies(prev => {
                if (isInitial) {
                    // При первичном SWR-запросе полностью обновляем топ (первые 50)
                    return newData;
                }
                // При скролле — склеиваем старый кэш с новыми данными
                return [...prev, ...newData];
            });

            if (isInitial) setHasLoadedOnce(true);
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') return;

            console.error('Ошибка загрузки вакансий:', err);
            if (!navigator.onLine) {
                setError({ type: 'network', message: 'Проверьте подключение к интернету.' });
            } else {
                setError({ type: 'server', message: 'Не удалось загрузить данные.' });
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [vacancies.length, hasLoadedOnce, setVacancies, setHasLoadedOnce]);

    // Эффект первичного монтирования (срабатывает при каждом переходе на страницу)
    useEffect(() => {
        const controller = new AbortController();
        // Запускаем как первичный запрос (isInitial = true)
        void fetchVacancies(controller.signal, true);
        return () => controller.abort();
    }, []); // 🌟 Важно: пустой массив зависимостей, чтобы SWR срабатывал строго 1 раз при заходе

    // Функция, которую мы будем вызывать, когда скролл дойдет до середины
    const loadMore = useCallback(() => {
        if (loadingMore || !hasMore || error) return;
        const controller = new AbortController();
        void fetchVacancies(controller.signal, false);
    }, [loadingMore, hasMore, error, fetchVacancies]);

    const handleRetry = () => {
        const controller = new AbortController();
        void fetchVacancies(controller.signal, vacancies.length === 0);
    };

    const processedVacancies = useMemo(() => {
        const sorted = [...vacancies];
        switch (sortBy) {
            case 'date':
                return sorted.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
            default:
                return sorted;
        }
    }, [vacancies, sortBy]);

    return {
        vacancies: processedVacancies,
        loading,
        loadingMore, // Отдаем наружу, чтобы снизу списка показать мелкий лоадер
        hasMore,     // Отдаем наружу, чтобы знать, нужно ли еще скроллить
        loadMore,    // 🌟 Функция-триггер для подгрузки следующей пачки
        error,
        sortBy,
        setSortBy,
        handleRetry
    };
}
