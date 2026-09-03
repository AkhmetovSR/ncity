// app/vacancy/_hooks/useVacancyNavigation.ts - хук инкапсулирует синхронизацию модалки и формы с кнопкой «Назад» браузера и URL-параметрами.
import { useEffect } from 'react';

interface UseVacancyNavigationProps {
    initialVacancyId: string;
    setActiveVacancyId: (id: string) => void;
    setIsFormOpen: (open: boolean) => void;
}

/**
 * Кастомный хук для синхронизации состояния шторки и формы с историей браузера (PopState)
 */
export function useVacancyNavigation({
                                         initialVacancyId,
                                         setActiveVacancyId,
                                         setIsFormOpen,
                                     }: UseVacancyNavigationProps) {

    useEffect(() => {
        // Если зашли по прямой ссылке на вакансию, помечаем состояние
        if (initialVacancyId) {
            window.history.replaceState({ type: 'direct-vacancy-modal' }, '');
        }

        const handlePopState = () => {
            const pathname = window.location.pathname;
            const isBaseVacancyRoute = pathname === '/vacancy' || pathname === '/vacancy/';
            const urlParams = new URLSearchParams(window.location.search);

            // Закрываем форму, если из URL пропал параметр ?add=true
            if (!urlParams.has('add')) {
                setIsFormOpen(false);
            }

            // Переключаем ID активной вакансии в зависимости от URL
            if (isBaseVacancyRoute) {
                setActiveVacancyId('');
            } else {
                const pathParts = pathname.split('/');
                const vacancyId = pathParts[pathParts.length - 1];
                if (vacancyId) setActiveVacancyId(vacancyId);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [initialVacancyId, setActiveVacancyId, setIsFormOpen]);

    /**
     * Безопасное открытие формы с добавлением параметров в URL
     */
    const openFormWithHistory = () => {
        setIsFormOpen(true);
        try {
            window.history.pushState({ type: 'vacancy-form' }, '', `${window.location.pathname}?add=true`);
        } catch (e) {
            console.warn('History API Error:', e);
        }
    };

    return { openFormWithHistory };
}
