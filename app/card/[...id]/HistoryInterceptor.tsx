// app/card/[...id]/HistoryInterceptor.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Перехватывает системную кнопку "Назад" и делает нативный переход на главную.
 */
export function HistoryInterceptor() {
    const router = useRouter();

    useEffect(() => {
        // Проверяем, что это первый заход и истории в этой вкладке еще нет
        if (typeof window !== 'undefined' && window.history.length === 1) {

            // Заталкиваем фейковую запись, чтобы кнопка "Назад" в браузере стала активной
            window.history.pushState({ page: 1 }, '', window.location.href);

            const handlePopState = (e: PopStateEvent) => {
                // Останавливаем стандартный вылет с сайта
                e.preventDefault();

                // Делаем нативный переход на главную страницу
                router.push('/', { scroll: false });
            };

            // Вешаем событие на кнопку "Назад" / свайп смартфона
            window.addEventListener('popstate', handlePopState);

            return () => {
                window.removeEventListener('popstate', handlePopState);
            };
        }
    }, [router]);

    return null;
}
