'use client';

import { motion, AnimatePresence } from 'framer-motion';
import s from '@/app/page.module.css';

interface StoreCardProps {
    id: string;
    gradient?: string;
    activeId: string | null;
    setActiveId: (id: string | null) => void;
    children?: React.ReactNode;
}

// const EXPANDED_TRANSITION = { type: 'spring', stiffness: 150, damping: 24 };

export default function StoreCard({
                                      id,
                                      gradient = 'transparent',
                                      activeId,
                                      setActiveId,
                                      children
                                  }: StoreCardProps) {
    const isOpen = activeId === id;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    layoutId={`card-bg-${id}`}
                    className={s.expandedCard}
                    style={{ background: gradient }}
                    // transition={EXPANDED_TRANSITION}
                    onClick={(e) => e.stopPropagation()} // Защита от закрытия при клике на контент
                >
                    <button className={s.closeButton} onClick={() => setActiveId(null)}>
                        ✕
                    </button>
                    <div className={s.contentWrapper}>
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
