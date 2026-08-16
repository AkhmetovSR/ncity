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

import React, { useState, useEffect } from 'react';
import { CARD_REGISTRY } from '@/app/cards'; // Наш статический реестр со всеми карточками портала
import { CardGrid } from '@/components/CardGrid'; // Компонент трехколоночной сетки карточек
import { SpecialPromoCard } from '@/components/SpecialPromoCard'; // Компонент специальной промо-карты вакансий
import { useAppHistory } from '@/hooks/useAppHistory'; // Наш канонический хук синхронизации URL
import Title from "@/components/Home/Title/Title"; // Визуальный заголовок главной страницы
import s from './Main.module.css'; // Локальные стили контейнера главной страницы

// Вытаскиваем массив объектов карточек из статического реестра для передачи в сетку
const CARDS_LIST = Object.values(CARD_REGISTRY);

// Описываем пропсы, которые Main может получить сверху от серверного роута Next.js (SSR)
interface MainProps {
    initialActiveId: string | null;    // Какую карточку открыть сразу при жестком заходе по ссылке
    initialVacancyId: string | null;   // Какую вакансию открыть внутри карточки при жестком заходе
}

export default function Main({ initialActiveId, initialVacancyId }: MainProps) {
    // 🌟 СИНХРОННЫЕ СТЕЙТЫ АНИМАЦИИ:
    // Они нужны Framer Motion, чтобы просыпаться за 0 миллисекунд.
    // Напрямую руками мы их не меняем — за них это будет делать хук use AppHistory,
    // как только увидит изменения в адресной строке браузера.
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeVacancyId, setActiveVacancyId] = useState<string | null>(null);

    // 🌟 ГИДРАТАЦИОННЫЙ МОСТ (SSR -> SPA):
    // Этот эффект срабатывает ОДИН раз при первой загрузке приложения.
    // Если пользователь зашел по прямой ссылке (например, /card/travel), сервер передаст
    // эти ID в пропсы initialActiveId, и эффект синхронно "прогреет" наши стейты,
    // чтобы шторка открылась сразу без белого экрана и морганий.
    useEffect(() => {
        if (initialActiveId) {
            setActiveId(initialActiveId);
        }
        if (initialVacancyId) {
            setActiveVacancyId(initialVacancyId);
        }
    }, [initialActiveId, initialVacancyId]);

    // 🌟 ПОДКЛЮЧЕНИЕ КАНОНИЧЕСКОГО ХУКА (Глаза и уши приложения):
    // Передаем в хук наши функции-сеттеры. Хук встает на дежурство, непрерывно слушает useParams()
    // и сам синхронно наполняет стейты activeId и activeVacancyId актуальными данными из URL.
    useAppHistory({
        setActiveId,
        setActiveVacancyId
    });

    return (
        <div className={s.storeContainer}>
            {/* Рендерим заголовок страницы */}
            <Title />

            {/* Промо-карточка вакансий. Передаем ей текущие стейты чтения из URL */}
            <SpecialPromoCard
                activeId={activeId}
                activeVacancyId={activeVacancyId}
            />

            {/* Сетка остальных 1000 карточек. Передаем список карт и стейт активного окна */}
            <CardGrid
                cards={CARDS_LIST}
                activeId={activeId}
            />
        </div>
    );
}
