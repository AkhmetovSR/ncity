'use client';

import { useEffect, useRef } from 'react';

interface HistoryStates {
    activeId: string | null;
    setActiveId: (id: string | null) => void;
    activeVacancyId: string | null;
    setActiveVacancyId: (id: string | null) => void;
}

export function useAppHistory({
                                  activeId,
                                  setActiveId,
                                  activeVacancyId,
                                  setActiveVacancyId
                              }: HistoryStates) {
    const isInternalChange = useRef(false);

    // 1. СИНХРОНИЗАЦИЯ: Из стейта React в URL браузера
    useEffect(() => {
        if (isInternalChange.current) {
            isInternalChange.current = false;
            return;
        }

        const currentPath = window.location.pathname;
        let targetPath = '/';

        if (activeId) {
            targetPath = `/card/${activeId}`;
            // Если это карточка вакансий и открыта конкретная вакансия
            if (activeId === 'vacancy' && activeVacancyId) {
                targetPath += `/${activeVacancyId}`;
            }
        }

        if (currentPath !== targetPath) {
            window.history.pushState(null, '', targetPath);
        }

        // Блокировка скролла body при любой открытой модалке
        if (activeId) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => document.body.classList.remove('no-scroll');
    }, [activeId, activeVacancyId]);

    // 2. ОБРАБОТКА КНОПКИ "НАЗАД" (POPSTATE): Из URL браузера в стейт React
    useEffect(() => {
        const handlePopState = () => {
            const segments = window.location.pathname.split('/').filter(Boolean);
            // Структура URL: segments[0] === 'card', segments[1] === activeId, segments[2] === vacancyId

            isInternalChange.current = true;

            if (segments[0] === 'card' && segments[1]) {
                setActiveId(segments[1]);
                setActiveVacancyId(segments[2] || null);
            } else {
                // Если вернулись на главную (/)
                setActiveId(null);
                setActiveVacancyId(null);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [setActiveId, setActiveVacancyId]);

    // 3. ОТКЛЮЧЕНИЕ КЭША СКРОЛЛА
    useEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }, []);
}
