'use client';

import React, { useState, useEffect } from 'react';
import { CARD_REGISTRY } from '@/app/cards';
import { CardGrid } from '@/components/CardGrid';
import { SpecialPromoCard } from '@/components/SpecialPromoCard';
import { useAppHistory } from '@/hooks/useAppHistory'; // Новый хук
import Title from "@/components/Home/Title/Title";
import s from './Main.module.css';

const CARDS_LIST = Object.values(CARD_REGISTRY);

interface MainProps {
    initialActiveId: string | null;
    initialVacancyId: string | null;
}

export default function Main({ initialActiveId, initialVacancyId }: MainProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    // Поднимаем стейт вакансии сюда для централизованного роутинга
    const [activeVacancyId, setActiveVacancyId] = useState<string | null>(null);

    // Hydration Safe Switch
    useEffect(() => {
        if (initialActiveId) {
            setActiveId(initialActiveId);
        }
        if (initialVacancyId) {
            setActiveVacancyId(initialVacancyId);
        }
    }, [initialActiveId, initialVacancyId]);

    // Один хук правит всей историей без конфликтов
    useAppHistory({
        activeId,
        setActiveId,
        activeVacancyId,
        setActiveVacancyId
    });

    return (
        <div className={s.storeContainer}>
            <Title />

            {/* Промо-карточка вакансий */}
            <SpecialPromoCard
                activeId={activeId}
                setActiveId={setActiveId}
                activeVacancyId={activeVacancyId} // Передаем стейт
                setActiveVacancyId={setActiveVacancyId} // Передаем сеттер
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
