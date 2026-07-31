'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import s from '@/app/page.module.css';

interface StoreCardProps {
    id: string;
    activeId: string | null;
    setActiveId: (id: string | null) => void;
    children?: React.ReactNode;
}

// const TAP_ANIMATION = { scale: 0.96 };
// const CARD_TRANSITION = { type: 'spring', stiffness: 220, damping: 26 };
// const EXPANDED_TRANSITION = { type: 'spring', stiffness: 150, damping: 24 };

export default function StoreCard({
                                      id,
                                      activeId,
                                      setActiveId,
                                      children
                                  }: StoreCardProps) {
    const isOpen = activeId === id;

    return (
        <section>
            {/* 1. СВЕРНУТАЯ КАРТОЧКА (В ЛЕНТЕ) */}
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
                    // style={{ background: gradient }}
                    // whileTap={TAP_ANIMATION}
                    // transition={CARD_TRANSITION}
                >
                    {/*/!* Если тег и титул переданы (как в CardGrid), показываем их *!/*/}
                    {/*{tag && <motion.span layoutId={`card-tag-${id}`} className={s.tag}>{tag}</motion.span>}*/}
                    {/*{title && <motion.h2 layoutId={`card-title-${id}`} className={s.cardTitle}>{title}</motion.h2>}*/}

                    {/* Если это твоя карточка с Lottie (без тегов), рендерится чистый children */}
                    {!isOpen && children}
                </motion.div>
            </Link>

            {/* 2. РАЗВЕРНУТАЯ КАРТОЧКА (МОДАЛКА) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        layoutId={`card-bg-${id}`}
                        className={s.expandedCard}
                        // style={{ background: gradient }}
                        // transition={EXPANDED_TRANSITION}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className={s.closeButton} onClick={() => setActiveId(null)}>✕</button>
                        <div className={s.contentWrapper}>
                            {/* Текст для обычных карточек из грида */}
                            {/*{tag && <motion.span layoutId={`card-tag-${id}`} className={s.tag}>{tag}</motion.span>}*/}
                            {/*{title && <motion.h2 layoutId={`card-title-${id}`} className={s.cardTitle}>{title}</motion.h2>}*/}

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
