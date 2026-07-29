'use client';

import { useState } from 'react';
import { CARD_REGISTRY } from './cards';
import { CardGrid } from '@/components/CardGrid';
import { SpecialPromoCard } from '@/components/SpecialPromoCard';
import { useCardHistory } from '@/hooks/useCardHistory';
import s from './page.module.css';

// Выносим сюда. Теперь массив создается ровно ОДИН раз при загрузке приложения,
// а не пересчитывается при каждом изменении стейта activeId.
const CARDS_LIST = Object.values(CARD_REGISTRY);

export default function HomePage() {
    const [activeId, setActiveId] = useState<string | null>(null);

    useCardHistory(activeId, setActiveId);

    return (
        <div className={s.storeContainer}>
            <main className={s.main}>
                <h1 className={s.pageTitle}>Today</h1>

                <SpecialPromoCard
                    activeId={activeId}
                    setActiveId={setActiveId}
                />

                <CardGrid
                    cards={CARDS_LIST} // Передаем оптимизированный список
                    activeId={activeId}
                    setActiveId={setActiveId}
                />

            </main>
        </div>
    );
}
