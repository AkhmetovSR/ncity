'use client';

import StoreCard from './StoreCard';
import s from '@/app/page.module.css';

// Исправили только тип, чтобы Next.js не ругался на реестр
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
                // Забираем твой cardComponent и сохраняем в твою переменную ContentComponent
                const ContentComponent = card.cardComponent;
                const isOpen = activeId === card.id;

                return (
                    <StoreCard
                        key={card.id}
                        id={card.id}
                        activeId={activeId}
                        setActiveId={setActiveId}
                    >
                        {/* Твой вызов компонента остался прежним, просто прокинули стейт */}
                        <ContentComponent isOpen={isOpen} />
                    </StoreCard>
                );
            })}
        </div>
    );
}
