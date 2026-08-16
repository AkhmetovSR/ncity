// // hooks/useAppHistory.ts
// 'use client';
//
// import { usePathname } from 'next/navigation';
// import { useLayoutEffect } from 'react';
//
// interface HistoryStates {
//     setActiveId: (id: string | null) => void;
//     setActiveVacancyId: (id: string | null) => void;
// }
//
// export function useAppHistory({ setActiveId, setActiveVacancyId }: HistoryStates) {
//     const pathname = usePathname();
//
//     useLayoutEffect(() => {
//         const segments = pathname.split('/').filter(Boolean);
//         let cardId: string | null = null;
//         let vacancyId: string | null = null;
//
//         const cardIndex = segments.indexOf('card');
//         if (cardIndex !== -1 && segments[cardIndex + 1]) {
//             cardId = segments[cardIndex + 1];
//             if (segments[cardIndex + 2]) {
//                 vacancyId = segments[cardIndex + 2];
//             }
//         }
//
//         // 🔥 ВСЕГДА обновляем стейты, даже если значения те же
//         setActiveId(cardId);
//         setActiveVacancyId(vacancyId);
//
//         document.body.style.overflow = cardId ? 'hidden' : '';
//
//         return () => {
//             document.body.style.overflow = '';
//         };
//     }, [pathname, setActiveId, setActiveVacancyId]);
//
//     useLayoutEffect(() => {
//         if ('scrollRestoration' in history) {
//             history.scrollRestoration = 'manual';
//         }
//     }, []);
// }

// hooks/useAppHistory.ts
'use client';

import { usePathname } from 'next/navigation';
import { useLayoutEffect } from 'react';

/**
 * 🌟 Интерфейс пропсов для хука
 * Определяет функции-сеттеры, которые будут обновлять состояние в родительском компоненте
 */
interface HistoryStates {
    setActiveId: (id: string | null) => void;          // Сеттер для ID активной карточки
    setActiveVacancyId: (id: string | null) => void;   // Сеттер для ID активной вакансии
}

/**
 * 🎯 КАНОНИЧЕСКИЙ ХУК СИНХРОНИЗАЦИИ URL С СОСТОЯНИЕМ
 *
 * 🔥 ГЛАВНАЯ ЗАДАЧА:
 * Синхронно обновлять React-состояние при каждом изменении URL,
 * чтобы Framer Motion мог корректно анимировать открытие/закрытие модалок.
 *
 * 🚀 КЛЮЧЕВЫЕ ОСОБЕННОСТИ:
 * 1. Использует useLayoutEffect вместо useEffect для синхронного обновления ДО отрисовки
 * 2. Парсит URL напрямую через usePathname (более надежно, чем useParams)
 * 3. Всегда обновляет стейты, даже если значения не изменились (триггерит перерендер)
 * 4. Управляет блокировкой скролла body при открытой модалке
 *
 * 🐛 ПОЧЕМУ НЕ useParams?
 * useParams может закэшировать значение и не обновиться при повторном переходе
 * на тот же URL (например, /card/vacancy → /card/vacancy).
 * usePathname всегда возвращает актуальный путь.
 *
 * 🐛 ПОЧЕМУ НЕ useEffect?
 * useEffect срабатывает ПОСЛЕ отрисовки, что вызывает задержку.
 * useLayoutEffect срабатывает ДО отрисовки, синхронно с DOM-мутациями.
 * Это критически важно для Framer Motion, чтобы анимация начиналась
 * в том же кадре, что и изменение URL.
 *
 * 🐛 ПОЧЕМУ ВСЕГДА ОБНОВЛЯЕМ СТЕЙТЫ?
 * При повторном открытии той же модалки (например, закрыли и снова открыли)
 * URL может быть одинаковым (/card/vacancy), но компонентам нужно
 * перерендериться для новой анимации.
 * Принудительное обновление стейта триггерит перерендер дочерних компонентов.
 */
export function useAppHistory({ setActiveId, setActiveVacancyId }: HistoryStates) {
    /**
     * usePathname - хук Next.js, который возвращает текущий путь
     * Обновляется при каждом изменении URL (включая переходы по истории)
     */
    const pathname = usePathname();

    /**
     * 🔥 useLayoutEffect вместо useEffect
     *
     * Почему это важно:
     * - Срабатывает СИНХРОННО после изменения DOM, но ДО отрисовки браузером
     * - Framer Motion видит новое состояние в том же кадре, что и изменение URL
     * - Анимация начинается без задержки и дерганий
     * - Предотвращает "мерцание" модалки
     */
    useLayoutEffect(() => {
        /**
         * 🧩 ПАРСИНГ URL
         *
         * Примеры:
         * /card/vacancy/123 → ['card', 'vacancy', '123']
         * /card/vacancy      → ['card', 'vacancy']
         * /about             → ['about']
         * /                  → []
         *
         * split('/') - разбивает строку по слешам
         * filter(Boolean) - удаляет пустые строки (например, из-за ведущего слеша)
         */
        const segments = pathname.split('/').filter(Boolean);

        /**
         * 🔍 ПОИСК ID КАРТОЧКИ И ВАКАНСИИ
         *
         * Ищем сегмент 'card' в пути. Если находим:
         * - Следующий сегмент (cardIndex + 1) - это ID карточки (например, 'vacancy')
         * - Следующий за ним (cardIndex + 2) - это ID вакансии (если есть)
         *
         * Пример: /card/vacancy/123
         * cardIndex = 0 (первый элемент массива)
         * cardId = segments[1] = 'vacancy'
         * vacancyId = segments[2] = '123'
         */
        let cardId: string | null = null;
        let vacancyId: string | null = null;

        // Ищем индекс сегмента 'card' в массиве
        const cardIndex = segments.indexOf('card');

        // Если нашли 'card' и есть следующий сегмент - это ID карточки
        if (cardIndex !== -1 && segments[cardIndex + 1]) {
            cardId = segments[cardIndex + 1];

            // Если есть еще один сегмент - это ID вакансии
            if (segments[cardIndex + 2]) {
                vacancyId = segments[cardIndex + 2];
            }
        }

        /**
         * 🔥 ПРИНУДИТЕЛЬНОЕ ОБНОВЛЕНИЕ СТЕЙТОВ
         *
         * Почему мы всегда вызываем setActiveId/setActiveVacancyId,
         * даже если значения не изменились?
         *
         * 1. При повторном открытии той же модалки:
         *    - Пользователь открыл /card/vacancy (activeId = 'vacancy')
         *    - Закрыл → URL стал / (activeId = null)
         *    - Снова открыл → URL стал /card/vacancy
         *    - usePathname обновился, но значение cardId такое же ('vacancy')
         *    - Если бы мы не вызвали setActiveId, React бы не перерендерил компоненты
         *    - Framer Motion не запустил бы анимацию открытия
         *
         * 2. Для Framer Motion важен не только факт изменения значения,
         *    но и сам факт вызова сеттера, который триггерит перерендер
         *
         * 3. Это гарантирует, что компоненты StoreCard и SpecialPromoCard
         *    всегда синхронизированы с текущим URL
         */
        setActiveId(cardId);
        setActiveVacancyId(vacancyId);

        /**
         * 🚫 БЛОКИРОВКА СКРОЛЛА
         *
         * При открытой модалке (cardId !== null) блокируем скролл body,
         * чтобы пользователь не мог прокручивать страницу за модалкой.
         *
         * При закрытии (cardId === null) возвращаем скролл.
         *
         * Используем style.overflow вместо classList для надежности:
         * - Не зависит от CSS-классов
         * - Работает даже если стили не загрузились
         * - Гарантированно переопределяет все другие стили
         */
        document.body.style.overflow = cardId ? 'hidden' : '';

        /**
         * 🧹 ОЧИСТКА ПРИ РАЗМОНТИРОВАНИИ
         *
         * Возвращаем функцию, которая снимает блокировку скролла,
         * когда компонент размонтируется или хук перезапускается.
         * Это предотвращает "залипание" скролла.
         */
        return () => {
            document.body.style.overflow = '';
        };

        /**
         * 📦 ЗАВИСИМОСТИ ХУКА
         *
         * pathname - триггерит перезапуск эффекта при каждом изменении URL
         * setActiveId, setActiveVacancyId - функции-сеттеры из родителя
         *
         * Важно: setActiveId и setActiveVacancyId должны быть стабильными
         * (обернуты в useCallback в родителе), чтобы избежать бесконечных циклов
         */
    }, [pathname, setActiveId, setActiveVacancyId]);

    /**
     * 🎯 ОТКЛЮЧЕНИЕ СКРОЛЛ-РЕСТОРА NEXT.JS
     *
     * Проблема: Next.js по умолчанию восстанавливает позицию скролла
     * при навигации (scrollRestoration: 'auto').
     *
     * Это мешает SPA-поведению, когда модалка открывается поверх страницы.
     *
     * Решение: Устанавливаем scrollRestoration: 'manual',
     * чтобы Next.js НЕ восстанавливал скролл при навигации.
     *
     * Теперь управление скроллом полностью в руках разработчика.
     *
     * useLayoutEffect - используем для синхронной установки ДО отрисовки
     */
    useLayoutEffect(() => {
        // Проверяем, что API доступен в браузере
        if ('scrollRestoration' in history) {
            // Устанавливаем ручное управление скроллом
            history.scrollRestoration = 'manual';
        }
    }, []); // Пустой массив зависимостей - эффект запускается один раз при монтировании
}