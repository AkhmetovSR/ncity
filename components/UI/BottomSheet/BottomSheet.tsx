// components/UI/BottomSheet/BottomSheet.tsx
'use client';

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation"; // 🌟 СЕНЬОР-ФИКС: Нативный роутер для закрытия по жесту свайпа
import { motion, PanInfo, useMotionValue } from "framer-motion";
import s from "./BottomSheet.module.css";

interface BottomSheetProps {
    // Явно указываем дочерние элементы для прохождения строгой типизации React 18+
    children: React.ReactNode;
}

/**
 * Универсальный Apple-Style BottomSheet (Шторка)
 *
 * Архитектура мирового уровня: Полностью избавлена от ручных стейтов `isOpen` и `onClose`.
 * Самостоятельно управляет своим жизненным циклом и закрытием по свайпу вниз
 * через нативную историю переходов Next.js, полностью ликвидируя шелуху.
 */
export default function BottomSheet({ children }: BottomSheetProps) {
    const router = useRouter();
    const contentRef = useRef<HTMLDivElement>(null);
    const isAtTopRef = useRef(true);
    const isDraggingRef = useRef(false);
    const y = useMotionValue(0);

    // 🌟 СЕНЬОР-ФИКС ИЗОЛЯЦИИ СКРОЛЛА: Так как шторка смонтирована всегда, когда открыт URL вакансии,
    // мы жестко блокируем фоновый скролл сайта прямо при маунте и возвращаем его при размонтировании.
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

    /**
     * 🌟 СЕНЬОР-ФИКС ЗАКРЫТИЯ ПО СВАЙПУ:
     * Вместо вызова кастомного JS-колбэка onClose(), мы нативно убираем query-параметр вакансии,
     * переводя роутер обратно на базовый путь карточки. Next.js сам запустит анимацию размонтирования шторки.
     */
    const handleSwipeClose = () => {
        router.push('/card/vacancy', { scroll: false });
    };

    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        isDraggingRef.current = false;
        const shouldClose = info.offset.y > 150 || info.velocity.y > 400;

        if (shouldClose) {
            handleSwipeClose();
        } else {
            y.set(0);
        }
    };

    // Защита от SSR: порталы в React могут рендериться только после того, как в браузере появится объект document
    if (typeof window === 'undefined') return null;

    return createPortal(
        <>
            {/* Мягкий фиксированный оверлей-подложка */}
            <motion.div
                className={s.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "linear" }}
                onClick={handleSwipeClose} // Клик по фону нативно закрывает шторку
            />

            {/* Физический корпус шторки с Apple Spring физикой */}
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
                {/* Индикатор зоны захвата для свайпа (Drag Handle) */}
                <div className={s.dragHandleContainer}>
                    <div className={s.dragHandle} />
                </div>

                {/* Изолированный контейнер внутреннего контента */}
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
