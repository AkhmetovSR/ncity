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
    initialVacancyId?: string | null; // Новое поле
}

export function SpecialPromoCard({ activeId, setActiveId, initialVacancyId = null }: SpecialPromoCardProps) {
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
                <motion.div layoutId={`card-bg-${id}`} className={s.cardBase}>
                    {!isOpen && <Job />}
                </motion.div>
            </Link>

            <StoreCard id={id} activeId={activeId} setActiveId={setActiveId}>
                {/* 🌟 Передаем начальный ID вакансии внутрь списка */}
                <VacancyList initialVacancyId={initialVacancyId} />
            </StoreCard>
        </div>
    );
}
