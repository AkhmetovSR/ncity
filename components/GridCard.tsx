'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import s from '@/app/page.module.css';

interface GridCardProps {
    id: string;
    gradient?: string;
    setActiveId: (id: string | null) => void;
    children: React.ReactNode;
}

// const TAP_ANIMATION = { scale: 0.96 };
// const CARD_TRANSITION = { type: 'spring', stiffness: 220, damping: 26 };

export function GridCard({ id, gradient, setActiveId, children }: GridCardProps) {
    return (
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
                /* 🌟 Соединяем базовые стили карточки и класс квадратности */
                className={`${s.cardBase} ${s.gridCard}`}
                style={{ background: gradient }}
                // whileTap={TAP_ANIMATION}
                // transition={CARD_TRANSITION}
            >
                {children}
            </motion.div>
        </Link>
    );
}
