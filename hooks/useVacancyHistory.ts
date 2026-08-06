import { useEffect, useRef } from 'react';

/**
 * Senior-канон: Синхронизирует стейт открытой вакансии с URL браузера (SPA-подход).
 * Полностью исключает жесткие переходы Next.js, сохраняя 120 FPS для Framer Motion.
 */
export function useVacancyHistory(
    activeVacancyId: string | null,
    setActiveVacancyId: (id: string | null) => void,
    parentCardId: string = "vacancy" // ID родительской модалки StoreCard
) {
    // Реф, чтобы избежать бесконечных циклов при синхронизации истории
    const isInternalChange = useRef(false);

    // Эффект 1: Слушаем изменение стейта и мягко меняем URL в браузере
    useEffect(() => {
        if (isInternalChange.current) {
            isInternalChange.current = false;
            return;
        }

        const currentPath = window.location.pathname;

        if (activeVacancyId) {
            // Формируем красивый глубокий путь, например: /card/vacancy/42
            const newPath = `/card/${parentCardId}/${activeVacancyId}`;
            if (currentPath !== newPath) {
                window.history.pushState({ vacancyId: activeVacancyId }, '', newPath);
            }
        } else {
            // Если шторка закрылась, возвращаем URL к пути родительской модалки: /card/vacancy
            const basePath = `/card/${parentCardId}`;
            if (currentPath.includes(parentCardId) && currentPath !== basePath) {
                window.history.pushState({ vacancyId: null }, '', basePath);
            }
        }
    }, [activeVacancyId, parentCardId]);

    // Эффект 2: Перехватываем системную кнопку "Назад" или свайп на смартфоне
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            // Проверяем путь в адресной строке
            const pathSegments = window.location.pathname.split('/');
            // Ищем ID вакансии в конце пути (например, из /card/vacancy/42 берем 42)
            const vacancyIdFromUrl = pathSegments[3] || null;

            isInternalChange.current = true;
            setActiveVacancyId(vacancyIdFromUrl);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [setActiveVacancyId]);
}
