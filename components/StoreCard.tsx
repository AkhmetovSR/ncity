'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import s from '@/components/StoreCard.module.css';

interface StoreCardProps {
    id: string;
    children?: React.ReactNode;
}

export default function StoreCard({ id, children }: StoreCardProps) {
    const router = useRouter();
    const pathname = usePathname();

    // Модалка открыта, только если URL строго соответствует этой карточке
    const isOpen = pathname === `/card/${id}`;

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    layoutId={`card-bg-${id}`}
                    className={s.expandedCard}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <button
                        className={s.closeButton}
                        onClick={() => router.back()}
                    >
                        ✕
                    </button>
                    <div className={s.innerScrollableContent}>
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
