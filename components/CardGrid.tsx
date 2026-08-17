'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import StoreCard from '@/components/StoreCard';
import s from '@/components/CardGrid.module.css';

interface CardItem {
    id: string;
    widget: React.ComponentType<{ isOpen: boolean }>;
}

interface CardGridProps {
    cards: CardItem[];
}

export function CardGrid({ cards }: CardGridProps) {
    const handleInstantOpen = (id: string) => {
        const event = new CustomEvent('force-open-card', { detail: { id } });
        window.dispatchEvent(event);
    };

    return (
        <div className={s.grid}>
            {cards.map((card) => {
                const WidgetComponent = card.widget;

                return (
                    <div key={card.id} className={s.cardWrapper}>
                        <Link
                            href={`/card/${card.id}`}
                            className={s.cardLink}
                            scroll={false}
                            onClick={() => handleInstantOpen(card.id)} // Мгновенный старт анимации
                        >
                            <motion.div
                                layoutId={`card-bg-${card.id}`}
                                className={s.cardBase}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            >
                                <div className={s.widgetVisible}>
                                    <WidgetComponent isOpen={false} />
                                </div>
                            </motion.div>
                        </Link>

                        {/*
                          Монтируем StoreCard прямо здесь для оптимистичного состояния.
                          Сюда прилетит реальный children из интерцептора, когда роутер дойдет до него.
                        */}
                        <StoreCard
                            id={card.id}
                            fallbackPreview={<WidgetComponent isOpen={true} />}
                        />
                    </div>
                );
            })}
        </div>
    );
}
