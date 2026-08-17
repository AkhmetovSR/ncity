'use client';

import React from 'react';
import Link from 'next/link';
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
    return (
        <div className={s.grid}>
            {cards.map((card) => {
                const WidgetComponent = card.widget;

                return (
                    <div key={card.id} className={s.cardWrapper}>
                        {/* КАНОНИЧЕСКАЯ ССЫЛКА ДЛЯ ОТКРЫТИЯ */}
                        <Link
                            href={`/card/${card.id}`}
                            className={s.cardLink}
                            scroll={false}
                        >
                            {/* Превью карточки в сетке */}
                            <motion.div
                                layoutId={`card-bg-${card.id}`}
                                className={s.cardBase}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 30
                                }}
                            >
                                <div className={s.widgetVisible}>
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
