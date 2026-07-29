'use client';

import { useEffect } from 'react';

export function useCardHistory(
    activeId: string | null,
    setActiveId: (id: string | null) => void
) {
    // 1. СИНХРОНИЗАЦИЯ URL С БРАУЗЕРОМ И БЛОКИРОВКА СКРОЛЛА
    useEffect(() => {
        if (activeId) {
            window.history.pushState(null, '', `/card/${activeId}`);
            document.body.classList.add('no-scroll');
        } else {
            window.history.pushState(null, '', '/');
            document.body.classList.remove('no-scroll');
        }
        return () => document.body.classList.remove('no-scroll');
    }, [activeId]);

    // 2. ОБРАБОТКА СИСТЕМНОЙ КНОПКИ "НАЗАД" ИЛИ СВАЙПА
    useEffect(() => {
        const handlePopState = () => {
            if (window.location.pathname === '/') {
                setActiveId(null);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [setActiveId]);

    // 3. ОТКЛЮЧЕНИЕ ЗАПОМИНАНИЯ СКРОЛЛА БРАУЗЕРОМ (ДЛЯ МОБИЛЬНЫХ)
    useEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }, []);
}
