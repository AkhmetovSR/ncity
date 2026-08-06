'use client';

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, PanInfo, useMotionValue } from "framer-motion";
import s from "./BottomSheet.module.css";

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

/**
 * Архитектурный шедевр: Самописный движок шторки Apple-style на чистом Framer Motion.
 * Полностью исключает конфликты жестов за счет синхронного анализа скролла контента через Ref.
 */
export default function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
    // Ссылка на контейнер скроллируемого контента
    const contentRef = useRef<HTMLDivElement>(null);
    // Контролирует, находится ли скролл в самом верху (0 пикселей от верха)
    const isAtTopRef = useRef(true);
    // Отслеживает, тянет ли пользователь шторку в данный момент
    const isDraggingRef = useRef(false);

    //Motion-переменная для отслеживания физического сдвига шторки по оси Y
    const y = useMotionValue(0);

    // Блокируем двойной скролл страницы при открытии шторки
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    /**
     * Обработчик нативного скролла контента внутри шторки.
     * Срабатывает мгновенно на уровне браузера, минуя циклы рендеринга React (0ms задержки).
     */
    const handleScroll = () => {
        if (!contentRef.current) return;

        const scrollTop = contentRef.current.scrollTop;
        // Если scrollTop равен 0, значит пользователь доскроллил текст до самого верха
        isAtTopRef.current = scrollTop <= 0;

        // Если пользователь скроллит контент вверх (вниз по тексту) и шторка начинает двигаться —
        // принудительно возвращаем её на место, чтобы текст не прыгал.
        if (!isAtTopRef.current && y.get() > 0 && !isDraggingRef.current) {
            y.set(0);
        }
    };

    /**
     * Проверяет жесты перетаскивания (Drag) перед их запуском.
     * Разрешает тянуть шторку только если:
     * 1. Текст доскроллен до самого верха (isAtTopRef.current === true)
     * 2. ИЛИ пользователь тянет шторку строго вниз (info.offset.y > 0)
     */
    const handleDrag = (_event: any, info: PanInfo) => {
        isDraggingRef.current = true;

        if (!isAtTopRef.current) {
            // Если текст не вверху, блокируем движение шторки вниз
            if (info.offset.y > 0) {
                // Если пользователь делает жест вниз, сбрасываем сдвиг шторки и отдаем приоритет скроллу текста
                y.set(0);
            }
        }
    };

    /**
     * Обработчик завершения жеста Apple-style: закрытие по скорости (Velocity) или по расстоянию (Offset)
     */
    const handleDragEnd = (_event: any, info: PanInfo) => {
        isDraggingRef.current = false;

        // Физика iOS: закрываем, если протащили ниже 150px ИЛИ дернули вниз с высокой скоростью
        const shouldClose = info.offset.y > 150 || info.velocity.y > 400;

        if (shouldClose) {
            onClose();
        } else {
            // Плавный резиновый возврат на исходную позицию
            y.set(0);
        }
    };

    if (typeof window === 'undefined') return null;

    return createPortal(
        <div className={s.wrapper}>
            {/* Нативный бэкдроп (затемнение фона) */}
            <motion.div
                className={s.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "linear" }}
                onClick={onClose}
            />

            {/* Физический корпус шторки с аппаратным ускорением */}
            <motion.div
                className={s.sheet}
                style={{ y }} // Привязываем позицию к нашей контролируемой переменной y
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 260 }} // Физика мягкого отскока Apple
                drag="y" // Тянется по вертикали
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0.02, bottom: 1 }} // Сверху жесткий упор (отскок 2%), снизу свободный ход
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
            >
                {/* Хэндл захвата */}
                <div className={s.dragHandleContainer}>
                    <div className={s.dragHandle} />
                </div>

                {/* Контентный контейнер с нативным скроллом */}
                <div
                    ref={contentRef}
                    className={s.content}
                    onScroll={handleScroll} // Навешиваем прямой синхронный обработчик скролла
                >
                    {children}
                </div>
            </motion.div>
        </div>,
        document.body
    );
}
