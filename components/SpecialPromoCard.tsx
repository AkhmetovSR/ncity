'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import StoreCard from '@/components/StoreCard';
import Job from "@/components/Home/Job/Job";
import VacancyList from "@/components/Home/Job/VacancyList/VacancyList";
import s from '@/components/SpecialPromoCard.module.css';

export function SpecialPromoCard() {
    const id = "vacancy";

    const handleInstantOpen = () => {
        const event = new CustomEvent('force-open-card', { detail: { id } });
        window.dispatchEvent(event);
    };

    return (
        <div className={s.VacancyCard}>
            <Link
                href={`/card/${id}`}
                className={s.cardLink}
                scroll={false}
                onClick={handleInstantOpen} // Мгновенный пинок
            >
                <motion.div
                    layoutId={`card-bg-${id}`}
                    className={s.cardBase}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <Job />
                </motion.div>
            </Link>

            {/*
              Оставляем StoreCard здесь. При клике он откроется за 0мс
              с контентом VacancyList, полностью игнорируя сетевой лаг Vercel
            */}
            {/*<StoreCard id={id} fallbackPreview={<VacancyList />}>*/}
            {/*    <VacancyList />*/}
            {/*</StoreCard>*/}
        </div>
    );
}
