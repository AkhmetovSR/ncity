// app/card/[...id]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import VacancyHeader from "@/components/Home/Job/VacancyInfo/VacancyHeader/VacancyHeader";
import VacancyContent from "@/components/Home/Job/VacancyInfo/VacancyContent/VacancyContent";
import VacancyList from "@/components/Home/Job/VacancyList/VacancyList";
import { PAGE_REGISTRY } from "@/app/cards";
import s from '@/app/page.module.css';

interface Props {
    params: Promise<{ id: string[] }>;
}

const VALID_CARD_IDS = new Set(['vacancy', 'travel', 'coding', 'A', 'B']);

export async function generateMetadata({ params }: Props) {
    const resolvedParams = await params;
    const pathSegments = resolvedParams.id || [];
    const cardId = pathSegments[0] || 'vacancy';
    const vacancyId = pathSegments[1] || null;

    const mockTitle = vacancyId ? `Вакансия №${vacancyId} в Нягани` : `Раздел ${cardId}`;

    return {
        title: `${mockTitle} — Работа и свежие объявления`,
        description: `Детальные условия, обязанности и требования на информационном портале города Нягань.`,
    };
}

export default async function HardRouteCardPage({ params }: Props) {
    const resolvedParams = await params;
    const pathSegments = resolvedParams?.id || [];

    const cardId = pathSegments[0] || null;
    const vacancyId = pathSegments[1] || null;

    if (!cardId || !VALID_CARD_IDS.has(cardId)) {
        notFound();
    }

    const ContentComponent = PAGE_REGISTRY[cardId] || null;
    const vacancyData = null; // Здесь будет ваш await db.getVacancy(vacancyId) при необходимости

    return (
        <div className={s.fullPageFallbackContent}>
            <Link href="/" className={s.backToMainButton} scroll={false}>
                ← На главную
            </Link>

            <div className={s.fallbackWrapper}>
                {/* Если открыта глубокая ссылка на вакансию (Уровень 2) при F5 — рендерим её изолированно для ИИ */}
                {vacancyId ? (
                    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                        <VacancyHeader />
                        <VacancyContent />
                    </div>
                ) : (
                    /* Если просто перезагрузили список (Уровень 1) */
                    cardId === 'vacancy' ? (
                        <VacancyList />
                    ) : ContentComponent ? (
                        <ContentComponent isOpen={true} />
                    ) : null
                )}
            </div>
        </div>
    );
}
