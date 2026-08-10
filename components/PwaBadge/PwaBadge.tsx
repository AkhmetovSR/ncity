'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import s from './PwaBadge.module.css';

export default function PwaBadge() {
    const { isInstallable, platform, handleInstallClick } = usePWAInstall();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!isInstallable) return null;

    const executeInstall = async () => {
        const isIosPlatform = await handleInstallClick();
        if (!isIosPlatform) {
            setIsModalOpen(false); // Закрываем для Android, так как вылетит системное окно
        }
    };

    return (
        <>
            <div className={s.badgeContainer}>
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={s.badgeButton}
                    onClick={() => setIsModalOpen(true)}
                    whileTap={{ scale: 0.92 }}
                >
                    📱
                </motion.button>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className={s.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            className={s.modalCard}
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={s.modalTitle}>Установка Smart Job</div>

                            {platform === 'android' ? (
                                <>
                                    <p className={s.modalText}>
                                        Установите приложение на рабочий стол вашего Android. Оно будет работать быстрее и во весь экран.
                                    </p>
                                    <button className={s.installBtn} onClick={executeInstall}>
                                        Установить прямо сейчас
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className={s.modalText} style={{ textAlign: 'left' }}>
                                        Чтобы установить приложение на **iPhone**:
                                        <br />1. Нажмите кнопку **«Поделиться»** (нижняя панель Safari).
                                        <br />2. Прокрутите меню вниз и выберите На экран Домой
                                    </p>
                                    <div style={{ fontSize: '24px', margin: '12px 0' }}>ios ➔ ⎋ ➔ ➕</div>
                                </>
                            )}

                            <button className={s.closeBtn} onClick={() => setIsModalOpen(false)}>
                                Закрыть
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
