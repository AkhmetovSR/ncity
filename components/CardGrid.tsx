// app/components/CardGrid.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { GridCard } from './GridCard';
import s from '@/app/page.module.css';

interface CardItem {
    id: string;
    widget: React.ComponentType<{ isOpen: boolean }>;
    cardComponent: React.ComponentType<{ isOpen: boolean }>;
}

interface CardGridProps {
    cards: CardItem[];
}

export function CardGrid({ cards }: CardGridProps) {
    const pathname = usePathname();

    return (
        <div className={s.grid}>
            {cards.map((card) => {
                const WidgetComponent = card.widget;
                const isOpen = pathname.startsWith(`/card/${card.id}`);

                return (
                    <section key={card.id} style={{ position: 'relative', width: '100%' }}>

                        {/* 🌟 ФОНОВАЯ ПОДЛОЖКА: Framer Motion будет растягивать только этот пустой блок */}
                        <motion.div
                            layoutId={`card-bg-${card.id}`}
                            className={s.cardBase}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                zIndex: 1,
                                pointerEvents: 'none'
                            }}
                            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                        />

                        {/* Интерактивный контент виджета поверх подложки */}
                        <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}>
                            <GridCard id={card.id}>
                                <div style={{
                                    opacity: isOpen ? 0 : 1,
                                    transition: 'opacity 0.2s ease',
                                    width: '100%',
                                    height: '100%'
                                }}>
                                    <WidgetComponent isOpen={false} />
                                </div>
                            </GridCard>
                        </div>

                    </section>
                );
            })}
        </div>
    );
}
