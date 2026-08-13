// components/UI/UniversalModal/UniversalModal.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import s from '@/app/page.module.css'; // Используем ваши родные глобальные модульные стили

interface UniversalModalProps {
    cardId: string | null;
    children: React.ReactNode;
}

/**
 * Универсальное модальное окно PWA Нягань (Эталонная геометрия)
 *
 * Компонент имеет строго одинаковые фиксированные размеры для всех типов карточек.
 * Жестко контролирует скругление углов и цвет фона на уровне ядра Framer Motion,
 * полностью ликвидируя графические артефакты, прозрачность и прыжки стилей.
 */
export default function UniversalModal({ cardId, children }: UniversalModalProps) {

    /**
     * Закрытие крестиком через идеальную имитацию системной кнопки "Назад".
     * Браузер стирает URL, Next.js убирает параллельный слот, а карточки возвращают видимость.
     */
    const handleClose = () => {
        if (typeof window !== 'undefined') {
            window.history.back(); // Нативно имитируем кнопку "Назад"
        }
    };

    // Динамически вычисляем целевой цвет фона для конкретного раздела
    // Для 'coding' это глубокий зеленый #1A2F2A, для вакансий или дефолтных страниц — черный #09090b.
    const targetBgColor = cardId === 'coding' ? '#1A2F2A' : '#09090b';

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
            }}
            onClick={handleClose} // Закрытие при клике по пустому пространству оверлея
        >
            {/*
              Основной бокс модального окна.
              🌟 layoutId строго синхронизирован с `card-bg-${cardId}` из GridCard и SpecialPromoCard.
              Мы передаем свойства border-radius и backgroundColor в initial и animate самого motion.div.
              Это заставляет Framer Motion удерживать идеальные 24px с первой до последней миллисекунды пружины.
            */}
            <motion.div
                layoutId={`card-bg-${cardId}`}
                className={s.expandedCard}
                onClick={(e) => e.stopPropagation()} // Защита от закрытия при клике на контент внутри окна
                transition={{ type: 'spring', stiffness: 220, damping: 26 }} // Родная сбалансированная пружина

                // Жестко фиксируем конфигурацию анимации на старте и в полете для победы над скачками
                initial={{
                    borderRadius: '24px',
                    backgroundColor: targetBgColor,
                    opacity: 1
                }}
                animate={{
                    borderRadius: '24px',
                    backgroundColor: targetBgColor,
                    opacity: 1
                }}
                style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    maxWidth: '480px', // Строго фиксированная ширина модалки для всех разделов сайта
                    height: '100%',
                    maxHeight: '85vh',  // Строго фиксированная максимальная высота
                    overflow: 'hidden',
                    borderRadius: '24px',
                    backgroundColor: targetBgColor,
                    opacity: 1,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
            >
                {/* Ваша верхняя нативная кнопка-крестик для закрытия */}
                <button className={s.closeButton} onClick={handleClose}>
                    ✕
                </button>

                {/* Обертка для независимого скролла внутреннего содержимого */}
                <div style={{ flex: 1, width: '100%', height: '100%', overflowY: 'auto' }}>
                    {/* Контент плавно проявляется после раскрытия геометрии */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.12 } }}
                        exit={{ opacity: 0 }}
                        style={{ height: '100%', width: '100%' }}
                    >
                        {children}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
