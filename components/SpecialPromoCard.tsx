'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import StoreCard from '@/components/StoreCard';
import Job from "@/components/Home/Job/Job";
import VacancyList from "@/components/Home/Job/VacancyList/VacancyList";
import s from '@/app/page.module.css';

interface SpecialPromoCardProps {
    activeId: string | null;
    setActiveId: (id: string | null) => void;
    activeVacancyId: string | null; // Изменено
    setActiveVacancyId: (id: string | null) => void; // Изменено
}

export function SpecialPromoCard({
                                     activeId,
                                     setActiveId,
                                     activeVacancyId,
                                     setActiveVacancyId
                                 }: SpecialPromoCardProps) {
    const id = "vacancy";
    const isOpen = activeId === id;

    return (
        <div className={s.VacancyCard}>
            <Link
                href={`/card/${id}`}
                className={s.cardLink}
                onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.button === 1) return;
                    e.preventDefault();
                    setActiveId(id);
                }}
            >
                {/* 🌟 Чтобы Framer Motion не сходил с ума, анимируем фон только когда карточка закрыта, либо убираем дубликат layoutId */}
                <motion.div layoutId={`card-bg-${id}`} className={s.cardBase}>
                    {!isOpen && <Job />}
                </motion.div>
            </Link>

            <StoreCard id={id} activeId={activeId} setActiveId={setActiveId}>
                {/* Передаем стейты управления внутрь списка */}
                <VacancyList
                    activeVacancyId={activeVacancyId}
                    setActiveVacancyId={setActiveVacancyId}
                />
            </StoreCard>
        </div>
    );
}
