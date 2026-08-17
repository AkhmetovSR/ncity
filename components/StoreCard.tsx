'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import s from '@/components/StoreCard.module.css';

interface StoreCardProps {
    id: string;
    children?: React.ReactNode;
    fallbackPreview?: React.ReactNode; // Проп для контента карточки (чтобы не было пустоты при загрузке)
}

export default function StoreCard({ id, children, fallbackPreview }: StoreCardProps) {
    const router = useRouter();
    const pathname = usePathname();

    const isUrlOpen = pathname === `/card/${id}`;
    const [isOptimisticOpen, setIsOptimisticOpen] = useState(isUrlOpen);

    // Синхронизация с URL (для кнопок "Назад/Вперед" и прямых заходов)
    useEffect(() => {
        setIsOptimisticOpen(isUrlOpen);
    }, [isUrlOpen]);

    // Ловим глобальный синхронный пинок к открытию карточки
    useEffect(() => {
        const handleForceOpen = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail.id === id) {
                setIsOptimisticOpen(true);
            }
        };
        window.addEventListener('force-open-card', handleForceOpen);
        return () => window.removeEventListener('force-open-card', handleForceOpen);
    }, [id]);

    const handleClose = () => {
        setIsOptimisticOpen(false);
        router.back();
    };

    const isOpen = isOptimisticOpen || isUrlOpen;

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    layoutId={`card-bg-${id}`}
                    className={s.expandedCard}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <button className={s.closeButton} onClick={handleClose}>
                        ✕
                    </button>
                    <div className={s.innerScrollableContent}>
                        {/*
                          Если Next.js еще не вернул children с сервера Vercel,
                          мы временно показываем превью-виджет, чтобы модалка не была пустой
                        */}
                        {children ? children : fallbackPreview}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
