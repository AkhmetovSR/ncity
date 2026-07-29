'use client';

import { StoreCard } from './StoreCard';
import s from '@/app/page.module.css';

// Описываем тип для отдельной карточки из регистра
interface CardItem {
    id: string;
    tag: string;
    title: string;
    gradient: string;
    component: React.ComponentType; // Тип для React-компонента контента
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
                const ContentComponent = card.component;
                return (
                    <StoreCard
                        key={card.id}
                        id={card.id}
                        tag={card.tag}
                        title={card.title}
                        gradient={card.gradient}
                        activeId={activeId}
                        setActiveId={setActiveId}
                    >
                        <ContentComponent />
                    </StoreCard>
                );
            })}
        </div>
    );
}
