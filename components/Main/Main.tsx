// // app/components/Main/Main.tsx
// 'use client';
//
// import React, { useState, useEffect } from 'react';
// import { CARD_REGISTRY } from '@/app/cards';
// import { CardGrid } from '@/components/CardGrid';
// import { SpecialPromoCard } from '@/components/SpecialPromoCard';
// import { useAppHistory } from '@/hooks/useAppHistory'; // Новый хук
// import Title from "@/components/Home/Title/Title";
// import s from './Main.module.css';
//
// const CARDS_LIST = Object.values(CARD_REGISTRY);
//
// interface MainProps {
//     initialActiveId: string | null;
//     initialVacancyId: string | null;
// }
//
// export default function Main({ initialActiveId, initialVacancyId }: MainProps) {
//     const [activeId, setActiveId] = useState<string | null>(null);
//     // Поднимаем стейт вакансии сюда для централизованного роутинга
//     const [activeVacancyId, setActiveVacancyId] = useState<string | null>(null);
//
//     // Hydration Safe Switch
//     useEffect(() => {
//         if (initialActiveId) {
//             setActiveId(initialActiveId);
//         }
//         if (initialVacancyId) {
//             setActiveVacancyId(initialVacancyId);
//         }
//     }, [initialActiveId, initialVacancyId]);
//
//     // Один хук правит всей историей без конфликтов
//     useAppHistory({
//         activeId,
//         setActiveId,
//         activeVacancyId,
//         setActiveVacancyId
//     });
//
//     return (
//         <div className={s.storeContainer}>
//             <Title />
//
//             {/* Промо-карточка вакансий */}
//             <SpecialPromoCard
//                 activeId={activeId}
//                 setActiveId={setActiveId}
//                 activeVacancyId={activeVacancyId} // Передаем стейт
//                 setActiveVacancyId={setActiveVacancyId} // Передаем сеттер
//             />
//
//             {/* Сетка стандартных карточек */}
//             <CardGrid
//                 cards={CARDS_LIST}
//                 activeId={activeId}
//                 setActiveId={setActiveId}
//             />
//         </div>
//     );
// }


// app/components/Main/Main.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation'; // 🌟 СЕНЬОР-ФИКС: Единственный источник правды для URL
import { CARD_REGISTRY } from '@/app/cards';
import { CardGrid } from '@/components/CardGrid';
import { SpecialPromoCard } from '@/components/SpecialPromoCard';
import Title from "@/components/Home/Title/Title";
import s from './Main.module.css';

const CARDS_LIST = Object.values(CARD_REGISTRY);

interface MainProps {
    initialActiveId: string | null;
    initialVacancyId: string | null;
}

/**
 * SPA-Ядро интерфейса (Компонент Main)
 *
 * Больше не хранит дублирующие стейты. Напрямую транслирует состояние URL
 * дочерним компонентам, полностью исключая рассинхронизацию при закрытии окон.
 */
export default function Main({ initialActiveId, initialVacancyId }: MainProps) {
    const pathname = usePathname(); // Получаем текущий путь (например, "/card/vacancy" или "/")

    /**
     * 🌟 СЕНЬОР-ВЫЧИСЛЕНИЕ СОСТОЯНИЯ:
     * Вытаскиваем ID активной карточки и вакансии напрямую из URL.
     * Если мы на главной ('/'), то активных ID нет (null).
     * Если роут начинается с '/card/', мы безопасно забираем сегменты.
     */
    const pathSegments = pathname.startsWith('/card/')
        ? pathname.split('/').filter(Boolean).slice(1) // Убираем сегмент 'card'
        : [];

    const activeId = pathSegments[0] || null;
    const activeVacancyId = pathSegments[1] || null;

    return (
        <div className={s.storeContainer}>
            {/* Заголовок главной страницы (логотип, приветствие города Нягань) */}
            <Title />

            {/* Специальная промо-карточка (блок "Все вакансии") */}
            <SpecialPromoCard
                activeId={activeId}
                setActiveId={() => {}} // Сеттер больше не нужен, роутинг идет через Link
                activeVacancyId={activeVacancyId}
                setActiveVacancyId={() => {}} // Сеттер больше не нужен
            />

            {/* Сетка стандартных контентных карточек компаний/категорий */}
            <CardGrid
                cards={CARDS_LIST}
                activeId={activeId}
                setActiveId={() => {}} // Сеттер больше не нужен
            />
        </div>
    );
}
