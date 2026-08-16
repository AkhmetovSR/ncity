// hooks/useAppHistory.ts
'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

interface HistoryStates {
    setActiveId: (id: string | null) => void;
    setActiveVacancyId: (id: string | null) => void;
}

/**
 * 🌟 КАНОНИЧЕСКИЙ ХУК НАВИГАЦИИ (ПОЛНЫЙ СЕНЬОР-ФИКС):
 * Работает СТРОГО на чтение нативного URL от Next.js [INDEX].
 * Никаких костыльных pushState и popstate [INDEX].
 * Роутер изменил URL -> хук синхронно обновил стейт для запуска Framer Motion [INDEX].
 */
export function useAppHistory({ setActiveId, setActiveVacancyId }: HistoryStates) {
    const params = useParams();

    useEffect(() => {
        // Канонично забираем сегменты динамического пути Next.js [INDEX]
        const pathSegments = (params?.id as string[]) || [];

        // segments[0] — это ID карточки, segments[1] — это ID вакансии
        const cardId = pathSegments[0] || null;
        const vacancyId = pathSegments[1] || null;

        // Синхронно прокидываем их в стейт презентационного ядра Main [INDEX]
        setActiveId(cardId);
        setActiveVacancyId(vacancyId);

        // Декларативно блокируем скролл body при любой открытой шторке
        if (cardId) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => document.body.classList.remove('no-scroll');
    }, [params, setActiveId, setActiveVacancyId]);

    // Отключение деструктивного кэша скролла Next.js для SPA-эффекта
    useEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }, []);
}
