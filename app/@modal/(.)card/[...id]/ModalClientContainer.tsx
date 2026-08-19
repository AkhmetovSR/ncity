'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import styles from './Modal.module.css';

interface ContainerProps {
    id: string;
    children: React.ReactNode;
}

export default function ModalClientContainer({ id, children }: ContainerProps) {
    const router = useRouter();
    const overlayRef = useRef<HTMLDivElement>(null);

    const handleClose = () => router.back();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) handleClose();
    };

    return (
        <div ref={overlayRef} onClick={handleOverlayClick} className={styles.backdrop}>
            <motion.div
                layoutId={id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                /*
                  Каноничная кривая Apple для интерфейсов:
                  [0.25, 1, 0.5, 1] — это сильное замедление к концу.
                  duration: 0.45 или 0.5 секунды дает тот самый "дорогой" масляный эффект.
                */
                transition={{
                    type: 'tween',
                    ease: [0.25, 1, 0.5, 1],
                    duration: 0.45
                }}
                className={styles.modalNode}
            >
                <button onClick={handleClose} className={styles.closeButton} aria-label="Закрыть">
                    <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className={styles.scrollContent}>
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
