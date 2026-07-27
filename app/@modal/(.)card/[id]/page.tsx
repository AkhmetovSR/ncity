'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import React, { use, useEffect } from 'react';
import { CARD_REGISTRY } from '@/app/cards'; // Путь поднялся выше из-за @modal
import s from './page.module.css';

export default function UniversalInterceptedPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const card = CARD_REGISTRY[id];

    useEffect(() => {
        if (!card) router.back();
    }, [card, router]);

    useEffect(() => {
        document.body.classList.add('no-scroll');
        return () => document.body.classList.remove('no-scroll');
    }, []);

    if (!card) return null;

    const ContentComponent = card.component;

    return (
        <>
            {/* Оверлей */}
            <motion.div
                className={s.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => router.back()}
            />

            {/* Окно плавно вылетает ИЗ КОНКРЕТНОЙ карточки, потому что они в одном контексте layout.tsx! */}
            <motion.div
                layoutId={`card-bg-${id}`}
                className={s.expandedCard}
                style={{ background: card.gradient }}
                transition={{ type: 'spring', stiffness: 200, damping: 24 }}
            >
                <button className={s.closeButton} onClick={() => router.back()}>✕</button>

                <div className={s.contentWrapper}>
                    <motion.span layoutId={`card-tag-${id}`} className={s.tag}>
                        {card.tag}
                    </motion.span>
                    <motion.h2 layoutId={`card-title-${id}`} className={s.cardTitle}>
                        {card.title}
                    </motion.h2>

                    <motion.div
                        className={s.bodyText}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.3 }}
                    >
                        {/* Подсовываем динамический контент */}
                        <ContentComponent />
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
}
