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


// // app/components/Main/Main.tsx
// 'use client';
//
// import React from 'react';
// import { CARD_REGISTRY } from '@/app/cards';
// import { CardGrid } from '@/components/CardGrid';
// import { SpecialPromoCard } from '@/components/SpecialPromoCard';
// import Title from "@/components/Home/Title/Title";
// import s from './Main.module.css';
//
// const CARDS_LIST = Object.values(CARD_REGISTRY);
//
// /**
//  * SPA-Ядро интерфейса (Главный экран)
//  * Идеальная декларативность. Ноль стейтов, ноль эффектов, ноль парсинга URL.
//  */
// export default function Main() {
//     return (
//         <div className={s.storeContainer}>
//             {/* Логотип и приветствие города Нягань */}
//             <Title />
//
//             {/* Специальная промо-карточка (блок "Все вакансии") */}
//             <SpecialPromoCard />
//
//             {/* Сетка стандартных контентных карточек компаний/категорий */}
//             <CardGrid cards={CARDS_LIST} />
//         </div>
//     );
// }

// components/Main/Main.tsx
'use client'; // Директива обязательна: компонент управляет интерактивным стейтом на клиенте

import React from 'react';
import { CARD_REGISTRY } from '@/app/cards'; // Наш статический реестр со всеми карточками портала
import { CardGrid } from '@/components/CardGrid'; // Компонент трехколоночной сетки карточек
import { SpecialPromoCard } from '@/components/SpecialPromoCard'; // Компонент специальной промо-карты вакансий
import Title from "@/components/Home/Title/Title"; // Визуальный заголовок главной страницы
import s from './Main.module.css'; // Локальные стили контейнера главной страницы

// Вытаскиваем массив объектов карточек из статического реестра для передачи в сетку
const CARDS_LIST = Object.values(CARD_REGISTRY);

export default function Main() {

    return (
        <div className={s.storeContainer}>
            {/* Рендерим заголовок страницы */}
            <Title />

            {/* Промо-карточка вакансий. Передаем ей текущие стейты чтения из URL */}
            <SpecialPromoCard/>

            {/* Сетка остальных 1000 карточек. Передаем список карт и стейт активного окна */}
            <CardGrid cards={CARDS_LIST}/>
        </div>
    );
}
