// // app/components/CardGrid.tsx
// 'use client';
//
// import React from 'react';
// import { usePathname } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { GridCard } from './GridCard';
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
// }
//
// export function CardGrid({ cards }: CardGridProps) {
//     const pathname = usePathname();
//
//     return (
//         <div className={s.grid}>
//             {cards.map((card) => {
//                 const WidgetComponent = card.widget;
//                 const isOpen = pathname.startsWith(`/card/${card.id}`);
//
//                 return (
//                     <section key={card.id} style={{ position: 'relative', width: '100%' }}>
//
//                         {/* 🌟 ФОНОВАЯ ПОДЛОЖКА: Framer Motion будет растягивать только этот пустой блок */}
//                         <motion.div
//                             layoutId={`card-bg-${card.id}`}
//                             className={s.cardBase}
//                             style={{
//                                 position: 'absolute',
//                                 inset: 0,
//                                 zIndex: 1,
//                                 pointerEvents: 'none'
//                             }}
//                             transition={{ type: 'spring', stiffness: 220, damping: 26 }}
//                         />
//
//                         {/* Интерактивный контент виджета поверх подложки */}
//                         <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}>
//                             <GridCard id={card.id}>
//                                 <div style={{
//                                     opacity: isOpen ? 0 : 1,
//                                     transition: 'opacity 0.2s ease',
//                                     width: '100%',
//                                     height: '100%'
//                                 }}>
//                                     <WidgetComponent isOpen={false} />
//                                 </div>
//                             </GridCard>
//                         </div>
//
//                     </section>
//                 );
//             })}
//         </div>
//     );
// }

// app/components/CardGrid.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import s from '@/components/CardGrid.module.css';

interface CardItem {
    id: string;
    widget: React.ComponentType<{ isOpen: boolean }>;
}

interface CardGridProps {
    cards: CardItem[];
}

export function CardGrid({ cards }: CardGridProps) {
    const pathname = usePathname();

    // 🌟 СЕНЬОР-ФИКС ГИДРАТАЦИИ: Флаг для синхронизации состояния сервера и клиента.
    // Предотвращает падение React из-за несовпадения HTML при первом рендере динамического пути.
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className={s.grid}>
            {cards.map((card) => {
                const WidgetComponent = card.widget;

                // Строгая проверка пути для предотвращения ложных срабатываний на схожих ID карточек
                const isOpen = pathname === `/card/${card.id}` || pathname.startsWith(`/card/${card.id}/`);

                return (
                    <div key={card.id} className={s.cardWrapper}>
                        <Link
                            href={`/card/${card.id}`}
                            className={s.cardLink}
                            scroll={false} // КРИТИЧНО ДЛЯ PWA: предотвращает прыжки экрана и сброс скролла на мобильных устройствах
                        >
                            {/*
                              🌟 СЕНЬОР-ФИКС СЛОЕВ: Контейнер motion.div имеет стабильные размеры и геометрию,
                              что позволяет Framer Motion корректно интерполировать координаты при закрытии шторки обратно в сетку.
                            */}
                            <motion.div
                                layoutId={`card-bg-${card.id}`}
                                className={s.cardBase}
                                transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                            >
                                {/*
                                  🌟 СЕНЬОР-АННИГИЛЯЦИЯ БАГА ГИДРАТАЦИИ И АНИМАЦИИ ЗАКРЫТИЯ:
                                  1. Вместо жесткого удаления `{!isOpen && ...}` мы сохраняем узел в DOM-дереве всегда.
                                     Если удалить узел из DOM во время смены URL, Framer Motion не сможет построить обратную анимацию
                                     к уменьшенному виджету, из-за чего карточка при закрытии будет мгновенно исчезать с белым мерцанием.
                                  2. Переключаем видимость через CSS-классы на основе гидратации (isMounted). До маунта виджет всегда видим.
                                */}
                                <div className={(isMounted && isOpen) ? s.widgetHidden : s.widgetVisible}>
                                    <WidgetComponent isOpen={false} />
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}