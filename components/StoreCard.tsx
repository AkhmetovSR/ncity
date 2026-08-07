'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import s from '@/app/page.module.css';

interface StoreCardProps {
    id: string;
    gradient?: string;
    activeId: string | null;
    setActiveId: (id: string | null) => void;
    children?: React.ReactNode;
}

export default function StoreCard({
                                      id,
                                      gradient = 'transparent',
                                      activeId,
                                      setActiveId,
                                      children
                                  }: StoreCardProps) {
    const isOpen = activeId === id;

    // 🧪 ТЕСТОВЫЙ ИНСТРУМЕНТ: Логируем каждый рендер компонента StoreCard
    const renderCount = useRef(0);
    renderCount.current += 1;

    console.log(`[TEST_RENDER] StoreCard (id: ${id}). Рендер №${renderCount.current}. isOpen: ${isOpen}, activeId: ${activeId}`);

    // 🧪 ТЕСТОВЫЙ ИНСТРУМЕНТ: Слежка за реальным появлением в DOM и стилями
    useEffect(() => {
        if (isOpen) {
            console.log(`[TEST_MOUNT] Карточка ${id} физически СМОНТИРОВАНА в DOM.`);

            // Проверяем, какой класс и какие стили прямо сейчас видит браузер
            // Ищем элемент по классу из CSS-модуля
            const element = document.querySelector(`.${s.expandedCard}`);

            if (element) {
                const computedStyle = window.getComputedStyle(element);
                console.log(`[TEST_DOM_EVIDENCE] Элемент найден! Свойства на момент монтирования:`, {
                    opacity: computedStyle.opacity,
                    position: computedStyle.position,
                    visibility: computedStyle.visibility,
                    display: computedStyle.display,
                    className: element.className
                });
            } else {
                console.warn(`[TEST_DOM_WARNING] isOpen === true, но элемент с классом ${s.expandedCard} НЕ НАЙДЕН в DOM!`);
            }
        }

        return () => {
            if (isOpen) {
                console.log(`[TEST_UNMOUNT] Карточка ${id} размонтирована из DOM.`);
            }
        };
    }, [isOpen, id]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    layoutId={`card-bg-${id}`}
                    className={s.expandedCard}
                >
                    <button className={s.closeButton} onClick={() => setActiveId(null)}>
                        ✕
                    </button>
                    <div className={s.contentWrapper}>
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
