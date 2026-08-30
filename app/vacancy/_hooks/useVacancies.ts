// app/vacancy/_hooks/useVacancies.ts
import { useState, useMemo, useCallback } from 'react';
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
    // Получаем глобальное состояние из контекста
    const { vacancies, setVacancies, hasLoadedOnce, setHasLoadedOnce } = useVacancyContext();

    // 🌟 СЕНЬОР-ФИКС: Реактивный loading. Он автоматически станет false,
    // как только контекст завершит фоновую предзагрузку данных.
    const loading = !hasLoadedOnce;

    const [loadingMore, setLoadingMore] = useState(false); // Лоадер бесконечного скролла
    const [error, setError] = useState<FetchError>(null);
    const [sortBy, setSortBy] = useState<'date' | 'salary-asc' | 'salary-desc'>('date');
    const [hasMore, setHasMore] = useState(true);

    const LIMIT = 50;

    /**
     * Функция дозагрузки следующих порций данных (вызывается при скролле или ошибке)
     */
    const fetchVacancies = useCallback(async (signal: AbortSignal, isInitial = false) => {
        const currentOffset = isInitial ? 0 : vacancies.length;

        if (!isInitial) {
            setLoadingMore(true);
        }

        if (error !== null) {
            setError(null);
        }

        try {
            const res = await fetch(`/vacancy/api?limit=${LIMIT}&offset=${currentOffset}`, { signal });
            if (!res.ok) throw new Error(`Server status ${res.status}`);

            const newData: Vacancy[] = await res.json();

            if (newData.length < LIMIT) {
                setHasMore(false); // Данные в БД закончились
            }

            setVacancies(prev => {
                if (isInitial) {
                    return newData; // Предотвращает дубли, если сработал ручной ретрай первого экрана
                }
                return [...prev, ...newData]; // Склеиваем порции при скролле
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
            setLoadingMore(false);
        }
    }, [vacancies.length, error, setVacancies, setHasLoadedOnce]);

    // 🌟 СЕНЬОР-ФИКС: Здесь больше нет дефолтного useEffect!
    // Запрос топа теперь полностью делегирован файлу VacancyContext.tsx

    // Триггер бесконечного скролла (offset > 0)
    const loadMore = useCallback(() => {
        if (loadingMore || !hasMore || error) return;
        const controller = new AbortController();
        void fetchVacancies(controller.signal, false);
    }, [loadingMore, hasMore, error, fetchVacancies]);

    // Публичный метод для ручного повтора запроса при сбоях
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
        loading, // Вычисляется "на лету" из контекста
        loadingMore,
        hasMore,
        loadMore,
        error,
        sortBy,
        setSortBy,
        handleRetry
    };
}
