'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import s from '@/app/page.module.css';

interface StoreCardProps {
    id: string;
    tag: string;
    title: string;
    gradient: string;
    activeId: string | null;
    setActiveId: (id: string | null) => void;
    children?: React.ReactNode;
}

// 🛠 Выносим настройки анимаций (чистый код, легко менять тайминги)
const TAP_ANIMATION = { scale: 0.96 };
const CARD_TRANSITION = { type: 'spring', stiffness: 220, damping: 26 };
const EXPANDED_TRANSITION = { type: 'spring', stiffness: 150, damping: 24 };

export function StoreCard({
                              id,
                              tag,
                              title,
                              gradient,
                              activeId,
                              setActiveId,
                              children
                          }: StoreCardProps) {
    const isOpen = activeId === id;

    return (
        <section>
            {/* 1. СВЕРНУТАЯ КАРТОЧКА */}
            <Link
                href={`/card/${id}`}
                className={s.cardLink}
                onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.button === 1) return;
                    e.preventDefault();
                    setActiveId(id);
                }}
            >
                <motion.div
                    layoutId={`card-bg-${id}`}
                    className={s.card}
                    style={{ background: gradient }}
                    whileTap={TAP_ANIMATION}
                    // transition={CARD_TRANSITION}
                >
                    <motion.span layoutId={`card-tag-${id}`} className={s.tag}>
                        {tag}
                    </motion.span>
                    <motion.h2 layoutId={`card-title-${id}`} className={s.cardTitle}>
                        {title}
                    </motion.h2>
                </motion.div>
            </Link>

            {/* 2. РАЗВЕРНУТАЯ КАРТОЧКА */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        layoutId={`card-bg-${id}`}
                        className={s.expandedCard}
                        style={{ background: gradient }}
                        // transition={EXPANDED_TRANSITION}
                        // onClick={(e) => e.stopPropagation()}
                        onClick={() => setActiveId(null)}
                    >
                        <button className={s.closeButton} onClick={() => setActiveId(null)}>
                            ✕
                        </button>
                        <div className={s.contentWrapper}>
                            {/* Добавили layoutId, чтобы текст не прыгал, а плавно увеличивался */}
                            <motion.span layoutId={`card-tag-${id}`} className={s.tag}>
                                {tag}
                            </motion.span>
                            <motion.h2 layoutId={`card-title-${id}`} className={s.cardTitle}>
                                {title}
                            </motion.h2>

                            <div className={s.bodyText}>
                                {children}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
