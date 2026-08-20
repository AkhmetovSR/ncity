// app/components/ModalClientContainer.tsx
'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
// Укажите правильный путь к вашему Modal.module.css
import styles from '@/app/components/Modal.module.css';

interface ContainerProps {
    id: string;
    children: React.ReactNode;
    onClose: () => void; // Принимаем экшен закрытия от родительской сетки
}

export default function ModalClientContainer({ id, children, onClose }: ContainerProps)   {
    // const overlayRef = useRef<HTMLDivElement>(null);

    // Универсальная функция закрытия модалки
    const handleClose = () => {
        // 1. Мгновенно убираем модалку из стейта, чтобы запустилась анимация схлопывания (exit)
        onClose();
        // 2. Нативно возвращаем URL на главную за 0 мс (работает без интернета)
        window.history.pushState(null, '', '/');
    };

    // Слушаем клавишу Escape для закрытия
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        /* Клик по бэкдропу закрывает модалку */
        // <div ref={overlayRef} onClick={(e) => e.target === overlayRef.current && handleClose()} className={styles.backdrop}>
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
        // </div>
    );
}
