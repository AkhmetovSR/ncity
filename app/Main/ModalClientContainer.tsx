'use client';

import { motion } from 'framer-motion';
import { useEffect, useCallback } from 'react'; // 1. Импортируем useCallback
import { useRouter } from 'next/navigation';
import styles from '@/app/Main/Modal.module.css';

interface ContainerProps {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
}

export default function ModalClientContainer({ id, children, onClose }: ContainerProps) {
    const router = useRouter();

    // 2. Оборачиваем функцию в useCallback, чтобы сохранить её ссылку между рендерами
    const handleClose = useCallback(() => {
        const isDirect = window.history.state?.type === 'direct-modal';

        if (isDirect) {
            router.push('/');
            onClose();
        } else {
            onClose();
            window.history.back();
        }
    }, [router, onClose]); // useCallback зависит от router и onClose

    // 3. Теперь handleClose стабильна, и useEffect не будет срабатывать вхолостую
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleClose]); // Передаем только стабильную handleClose

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, pointerEvents: 'none' }}
                transition={{ type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.45 }}
                onClick={handleClose}
                className={styles.overlayNode}
            />

            <motion.div
                layoutId={id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.45 }}
                className={styles.modalNode}
            >
                <button onClick={handleClose} className={styles.closeButton} aria-label="Закрыть">
                    ✕
                </button>
                <div className={styles.scrollContent}>
                    {children}
                </div>
            </motion.div>
        </>
    );
}
