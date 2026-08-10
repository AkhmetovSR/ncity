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

export default function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const isAtTopRef = useRef(true);
    const isDraggingRef = useRef(false);
    const y = useMotionValue(0);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleScroll = () => {
        if (!contentRef.current) return;
        const scrollTop = contentRef.current.scrollTop;
        isAtTopRef.current = scrollTop <= 0;

        if (!isAtTopRef.current && y.get() > 0 && !isDraggingRef.current) {
            y.set(0);
        }
    };

    // ТИПИЗАЦИЯ:MouseEvent | TouchEvent | PointerEvent обрабатывает все типы ввода движения
    const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        isDraggingRef.current = true;
        if (!isAtTopRef.current && info.offset.y > 0) {
            y.set(0);
        }
    };

    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        isDraggingRef.current = false;
        const shouldClose = info.offset.y > 150 || info.velocity.y > 400;

        if (shouldClose) {
            onClose();
        } else {
            y.set(0);
        }
    };

    if (typeof window === 'undefined') return null;

    return createPortal(
        <>
            {/* 🌟 СЕНЬОР-ФИКС: Возвращаем оверлей с асимметричной анимацией */}
            <motion.div
                className={s.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                    // При открытии — плавное проявление за 0.2с
                    duration: 0.05,
                    ease: "linear",
                    // При закрытии — мгновенное исчезновение за 0 секунд!
                    // exit: { duration: 0 }
                }}
                onClick={onClose}
            />

            {/* Физический корпус шторки (его плавная spring-анимация остается нетронутой) */}
            <motion.div
                className={s.sheet}
                style={{ y }}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 260 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0.02, bottom: 1 }}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
            >
                <div className={s.dragHandleContainer}>
                    <div className={s.dragHandle} />
                </div>

                <div
                    ref={contentRef}
                    className={s.content}
                    onScroll={handleScroll}
                >
                    {children}
                </div>
            </motion.div>
        </>,
        document.body
    );
}
