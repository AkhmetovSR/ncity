'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import React, { use, useEffect } from 'react';
import { CARD_REGISTRY } from '@/app/cards';
import s from './page.module.css';

export default function UniversalInterceptedPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    // Находим данные карточки в нашем реестре
    const card = CARD_REGISTRY[id];

    // Защита от несуществующих ID (возвращаем 404 или закрываем)
    useEffect(() => {
        if (!card) router.back();
    }, [card, router]);

    useEffect(() => {
        document.body.classList.add('no-scroll');
        return () => document.body.classList.remove('no-scroll');
    }, []);

    if (!card) return null;

    // Динамически берем компонент, который нужно "подсунуть"
    const ContentComponent = card.component;

    return (
        <>
            <motion.div
                className={s.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => router.back()}
            />

            <motion.div
                layoutId={`card-bg-${id}`} // Динамический ID — карточка взлетит ровно со своего места!
                className={s.expandedCard}
                style={{ background: card.gradient }} // Накатываем уникальный дизайн
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

                    {/* Анимированный контейнер для подсовываемого компонента */}
                    <motion.div
                        className={s.bodyText}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.3 }}
                    >
                        {/* Рендерим динамический компонент контента */}
                        <ContentComponent />
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
}
