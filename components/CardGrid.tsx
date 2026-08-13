// // app/components/CardGrid.tsx
// 'use client';
//
// import React from 'react';
// import { GridCard } from './GridCard';
// import StoreCard from './StoreCard';
// import s from '@/app/page.module.css';
//
// interface CardItem {
//     id: string;
//     widget: React.ComponentType<{ isOpen: boolean }>;
//     cardComponent: React.ComponentType<{ isOpen: boolean }>;
// }
//
// interface CardGridProps {
//     cards: CardItem[];
//     activeId: string | null;
//     setActiveId: (id: string | null) => void;
// }
//
// export function CardGrid({ cards, activeId, setActiveId }: CardGridProps) {
//     return (
//         <div className={s.grid}>
//             {cards.map((card) => {
//                 const ContentComponent = card.cardComponent;
//                 const WidgetComponent = card.widget;
//                 const isOpen = activeId === card.id;
//
//                 return (
//                     <section key={card.id}>
//                         <GridCard id={card.id} setActiveId={setActiveId}>
//                             {/* 🌟 СЕНЬОР-ФИКС: Оставляем виджет в DOM, управляя видимостью через прозрачность */}
//                             <div style={{
//                                 opacity: isOpen ? 0 : 1,
//                                 transition: 'opacity 0.2s ease',
//                                 width: '100%',
//                                 height: '100%'
//                             }}>
//                                 <WidgetComponent isOpen={false} />
//                             </div>
//                         </GridCard>
//
//                         <StoreCard id={card.id} activeId={activeId} setActiveId={setActiveId}>
//                             <ContentComponent isOpen={true} />
//                         </StoreCard>
//                     </section>
//                 );
//             })}
//         </div>
//     );
// }

// app/components/CardGrid.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation'; // Привязываемся к URL напрямую
import { GridCard } from './GridCard';
import StoreCard from './StoreCard';
import s from '@/app/page.module.css';

interface CardItem {
    id: string;
    widget: React.ComponentType<{ isOpen: boolean }>;
    cardComponent: React.ComponentType<{ isOpen: boolean }>;
}

interface CardGridProps {
    cards: CardItem[];
}

/**
 * Компонент основной сетки карточек (CardGrid)
 * Самостоятельно вычисляет открытость каждой карточки на основе usePathname.
 */
export function CardGrid({ cards }: CardGridProps) {
    const pathname = usePathname(); // Получаем текущий путь один раз для всей сетки

    return (
        <div className={s.grid}>
            {cards.map((card) => {
                const ContentComponent = card.cardComponent;
                const WidgetComponent = card.widget;

                // Прямое сравнение с URL: карточка знает, открыта ли она, без помощи внешних стейтов
                const isOpen = pathname.startsWith(`/card/${card.id}`);

                return (
                    <section key={card.id}>
                        {/* Интерактивная карточка в сетке на базе нативного <Link> */}
                        <GridCard id={card.id}>
                            {/* Управляем видимостью виджета через opacity на основе URL */}
                            <div style={{
                                opacity: isOpen ? 0 : 1,
                                transition: 'opacity 0.2s ease',
                                width: '100%',
                                height: '100%'
                            }}>
                                <WidgetComponent isOpen={false} />
                            </div>
                        </GridCard>

                        {/* StoreCard для параллельного рендеринга на главной (скрытый слой фона) */}
                        <StoreCard id={card.id}>
                            <ContentComponent isOpen={true} />
                        </StoreCard>
                    </section>
                );
            })}
        </div>
    );
}
