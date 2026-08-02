'use client';

import React from 'react';
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
    activeId: string | null;
    setActiveId: (id: string | null) => void;
}

export function CardGrid({ cards, activeId, setActiveId }: CardGridProps) {
    return (
        <div className={s.grid}>
            {cards.map((card) => {
                const ContentComponent = card.cardComponent;
                const WidgetComponent = card.widget;
                const isOpen = activeId === card.id;

                return (
                    <section key={card.id}>
                        {/* 1. На экране в сетке рисуется твой чистый виджет в режиме свернутого окна */}
                        <GridCard id={card.id} setActiveId={setActiveId}>
                            {!isOpen && <WidgetComponent isOpen={false} />}
                        </GridCard>

                        {/* 2. Её независимая модалка в режиме открытого окна */}
                        <StoreCard id={card.id} activeId={activeId} setActiveId={setActiveId}>
                            <ContentComponent isOpen={true} />
                        </StoreCard>
                    </section>
                );
            })}
        </div>
    );
}
