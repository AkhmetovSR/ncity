'use client';

import React, { useState, useEffect } from 'react';
import { CARD_REGISTRY } from '@/app/cards';
import { CardGrid } from '@/components/CardGrid';
import { SpecialPromoCard } from '@/components/SpecialPromoCard';
import { useCardHistory } from '@/hooks/useCardHistory';
import Title from "@/components/Home/Title/Title";
import s from './Main.module.css';

const CARDS_LIST = Object.values(CARD_REGISTRY);

interface MainProps {
    initialActiveId: string | null;
    initialVacancyId: string | null;
}

export default function Main({ initialActiveId, initialVacancyId }: MainProps) {
    // 🌟 СЕНЬОР-ФИКС 1: Стартуем с null. Это заставляет React в самый первый микро-миг
    // отрендерить только нижнюю сетку карточек и зафиксировать их физические координаты в DOM.
    const [activeId, setActiveId] = useState<string | null>(null);

    // Эффект изоморфного восстановления состояния (Hydration Safe Switch)
    useEffect(() => {
        if (initialActiveId) {
            // Включаем активную модалку сразу после того, как сетка карточек встала на экран.
            // Зазор в 0 миллисекунд неощутим для глаза, но критичен для Framer Motion!
            setActiveId(initialActiveId);
        }
    }, [initialActiveId]);

    // Синхронизация истории URL
    useCardHistory(activeId, setActiveId);

    return (
        <div className={s.storeContainer}>
            <Title />

            {/* Промо-карточка вакансий */}
            <SpecialPromoCard
                activeId={activeId}
                setActiveId={setActiveId}
                initialVacancyId={initialVacancyId}
            />

            {/* Сетка стандартных карточек */}
            <CardGrid
                cards={CARDS_LIST}
                activeId={activeId}
                setActiveId={setActiveId}
            />
        </div>
    );
}
