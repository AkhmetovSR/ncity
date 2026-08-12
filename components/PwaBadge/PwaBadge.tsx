'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import s from './PwaBadge.module.css';

export default function PwaBadge() {
    const { isInstallable, platform, handleInstallClick } = usePWAInstall();
    const [showIosTooltip, setShowIosTooltip] = useState(false);

    // if (!isInstallable) return null;

    const handleClick = async () => {
        if (platform === 'ios') {
            // Для iPhone переключаем показ красивой инструкции
            setShowIosTooltip((prev) => !prev);
        } else {
            // Для Android ТУТ ЖЕ вызываем нативное системное окно Chrome! Без лишних кликов
            await handleInstallClick();
        }
    };

    return (
        <>
            {/* Единственная фиксированная кнопка в углу экрана */}
            <div className={s.badgeContainer}>
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={s.badgeButton}
                    onClick={handleClick}
                    whileTap={{ scale: 0.92 }}
                >
                    📱
                </motion.button>
            </div>

            {/* Аккуратная подсказка только для пользователей iPhone */}
            <AnimatePresence>
                {showIosTooltip && platform === 'ios' && (
                    <motion.div
                        className={s.iosTooltip}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        onClick={() => setShowIosTooltip(false)}
                    >
                        <p className={s.iosText}>
                            Нажмите кнопку <strong>«Поделиться»</strong> <span className={s.appleIcon}>⎋</span> в меню Safari, затем прокрутите вниз и выберите <strong>«На экран "Домой"»</strong> ➕.
                        </p>
                        <div className={s.tooltipArrow} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
