// components/UI/BottomSheet/BottomSheet.tsx
'use client';

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, PanInfo, useMotionValue } from "framer-motion";
import s from "./BottomSheet.module.css";

interface BottomSheetProps {
    children: React.ReactNode;
}

export default function BottomSheet({ children }: BottomSheetProps) {
    const router = useRouter();
    const contentRef = useRef<HTMLDivElement>(null);
    const isAtTopRef = useRef(true);
    const isDraggingRef = useRef(false);
    const y = useMotionValue(0);

    // Блокируем фоновый скролл сайта при монтировании шторки и возвращаем при ее уничтожении
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleScroll = () => {
        if (!contentRef.current) return;
        const scrollTop = contentRef.current.scrollTop;
        isAtTopRef.current = scrollTop <= 0;

        if (!isAtTopRef.current && y.get() > 0 && !isDraggingRef.current) {
            y.set(0);
        }
    };

    const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        isDraggingRef.current = true;
        if (!isAtTopRef.current && info.offset.y > 0) {
            y.set(0);
        }
    };

    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        isDraggingRef.current = false;
        // Свайп вниз на 150px имитирует кнопку "Назад" в браузере, сохраняя нативный стек истории чистым
        const shouldClose = info.offset.y > 150 || info.velocity.y > 400;

        if (shouldClose) {
            router.back();
        } else {
            y.set(0);
        }
    };

    if (typeof window === 'undefined') return null;

    return createPortal(
        <>
            {/* Анимированный оверлей-подложка шторки */}
            <motion.div
                className={s.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }} // Плавно растворяется при закрытии шторки
                transition={{ duration: 0.15, ease: "linear" }}
                onClick={() => router.back()} // Клик по фону — нативный шаг назад
            />

            {/* Физический корпус шторки с Apple Spring физикой */}
            <motion.div
                className={s.sheet}
                style={{ y }}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }} // 🌟 КРИТИЧНО ДЛЯ АНИМАЦИИ: плавно уезжает вниз при router.back()
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
