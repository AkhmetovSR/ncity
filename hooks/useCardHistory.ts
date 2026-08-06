'use client';

import { useEffect } from 'react';

/**
 * Хук синхронизации истории для карточек первого уровня.
 * Добавлены защитные условия для предотвращения затирания глубоких вложенных роутов.
 */
export function useCardHistory(
    activeId: string | null,
    setActiveId: (id: string | null) => void
) {
    // 1. СИНХРОНИЗАЦИЯ URL С БРАУЗЕРОМ И БЛОКИРОВКА СКРОЛЛА
    useEffect(() => {
        if (activeId) {
            const currentPath = window.location.pathname;
            const targetPath = `/card/${activeId}`;

            /* 🌟 СЕНЬОР-ФИКС: Защита от затирания вложенных роутов (типа /card/vacancy/1) */
            /* Если текущий путь в браузере уже глубже (длиннее), чем целевой, и начинается с него, */
            /* мы отменяем вызов pushState. Это сохраняет ID вакансии в URL при обновлении страницы! */
            if (currentPath.startsWith(targetPath) && currentPath.length > targetPath.length) {
                document.body.classList.add('no-scroll');
                return;
            }

            // Обычная синхронизация, если пути не совпадают
            if (currentPath !== targetPath) {
                window.history.pushState(null, '', targetPath);
            }
            document.body.classList.add('no-scroll');
        } else {
            // Если карточка закрыта, но мы всё еще не на главной (например, нажали крестик), возвращаем корень
            if (window.location.pathname !== '/') {
                window.history.pushState(null, '', '/');
            }
            document.body.classList.remove('no-scroll');
        }
        return () => document.body.classList.remove('no-scroll');
    }, [activeId]);

    // 2. ОБРАБОТКА СИСТЕМНОЙ КНОПКИ "НАЗАД" ИЛИ СВАЙПА
    useEffect(() => {
        const handlePopState = () => {
            // Исправлено: если мы ушли с карточки обратно на главную, сбрасываем activeId
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
