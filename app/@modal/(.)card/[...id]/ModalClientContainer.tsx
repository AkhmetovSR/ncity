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

    return (
        <div ref={overlayRef} onClick={(e) => e.target === overlayRef.current && handleClose()} className={styles.backdrop}>
            <motion.div
                layoutId={id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                /* Идентичный Apple-эффект без пружин и отскоков */
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
        </div>
    );
}
