// components/Home/Job/VacancyList/VacancySheet.tsx
'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import s from './VacancySheet.module.css';

interface VacancySheetProps {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
}

export default function VacancySheet({ id, children, onClose }: VacancySheetProps) {
    const router = useRouter();

    const handleClose = () => {
        // Железобетонная копия твоей логики модалок
        const isDirect = window.history.state?.type === 'direct-vacancy-modal';

        if (isDirect) {
            onClose();
            router.push('/vacancy');
        } else {
            onClose();
            window.history.back();
        }
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);

    return (
        <>
            {/*
              🌟 СЕНЬОР-ФИКС: Оверлеем и задником теперь является один плоский motion.div.
              В момент вызова onClose() он мгновенно считывается как удаляемый,
              плавно исчезает, и больше НЕ блокирует клики по карточкам сзади!
            */}
            <motion.div
                className={s.backdropOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.35 }}
                onClick={handleClose} // Клик по фону закрывает шторку
            />

            {/* Сама шторка рендерится как независимый узел на том же уровне */}
            <motion.div
                layoutId={id} // Твоя нативная связка по id
                className={s.sheet}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: 'spring', damping: 30, stiffness: 260, mass: 0.8 }}
            >
                <div className={s.dragHandle} onClick={handleClose} />

                <div className={s.content}>
                    {children}

                    <button className={s.closeButton} onClick={handleClose}>
                        Закрыть
                    </button>
                </div>
            </motion.div>
        </>
    );
}
