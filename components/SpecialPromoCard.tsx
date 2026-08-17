// components/SpecialPromoCard.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Job from "@/components/Home/Job/Job";
import s from '@/components/SpecialPromoCard.module.css';

export function SpecialPromoCard() {
    const id = "vacancy";

    return (
        <div className={s.VacancyCard}>
            <Link
                href={`/card/${id}`}
                className={s.cardLink}
                scroll={false}
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
               🔥 ЧИСТОТА: StoreCard отсюда УБРАН.
               Когда пользователь кликнет по этой ссылке, Next.js сам подставит
               компонент StoreCard вместе с VacancyList внутрь слота @modal
               через интерцептор роутов.
            */}
        </div>
    );
}
