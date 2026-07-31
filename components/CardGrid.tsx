'use client';

import React from 'react';
import { GridCard } from './GridCard';
import StoreCard from './StoreCard';
import s from '@/app/page.module.css';

interface CardItem {
    id: string;
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
                const isOpen = activeId === card.id;

                return (
                    <section key={card.id}>
                        {/* 1. Квадратная карточка в сетке */}
                        <GridCard id={card.id} setActiveId={setActiveId}>
                            {!isOpen && <ContentComponent isOpen={false} />}
                        </GridCard>

                        {/* 2. Её независимая модалка */}
                        <StoreCard id={card.id} activeId={activeId} setActiveId={setActiveId}>
                            <ContentComponent isOpen={true} />
                        </StoreCard>
                    </section>
                );
            })}
        </div>
    );
}
