'use client';

import { motion } from 'framer-motion';
import { useEffect, useCallback } from 'react'; // 1. Добавили useCallback сюда
import { useRouter } from 'next/navigation';
import s from './VacancySheet.module.css';
import styles from "@/app/components/Modal.module.css";

interface VacancySheetProps {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
}

export default function VacancySheet({ id, children, onClose }: VacancySheetProps) {
    const router = useRouter();

    // 2. Оборачиваем в useCallback, фиксируя ссылку на функцию
    const handleClose = useCallback(() => {
        const isDirect = window.history.state?.type === 'direct-vacancy-modal';

        if (isDirect) {
            onClose();
            router.push('/vacancy');
        } else {
            onClose();
            window.history.back();
        }
    }, [router, onClose]); // Зависимости для логики закрытия

    // Блокировка скролла страницы (работает независимо)
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // 3. Слушатель нажатия клавиши Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleClose]); // Передаем только стабильную функцию handleClose

    return (
        <>
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0, pointerEvents: 'none'}}
                transition={{type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.45}}
                onClick={handleClose}
                className={styles.overlayNode}
            />

            <motion.div
                layoutId={id}
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