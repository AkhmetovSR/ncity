// app/@modal/SharedModalContainer.tsx
'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import VacancyList from "@/components/Home/Job/VacancyList/VacancyList";
import { PAGE_REGISTRY } from "@/app/cards";
import s from '@/app/@modal/SharedModalContainer.module.css'; // Перенесите сюда стили из старой модалки

interface SharedModalProps {
    isOpen: boolean;
    cardId: string | null;
    vacancyId: string | null;
}

export function SharedModalContainer({ isOpen, cardId, vacancyId }: SharedModalProps) {
    const router = useRouter();

    // Безопасная блокировка скролла из Шага 2: работает только когда модалка реально открыта
    useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        const originalTouchAction = document.body.style.touchAction;
        document.body.style.setProperty('overflow', 'hidden', 'important');
        document.body.style.setProperty('touch-action', 'none', 'important');

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.touchAction = originalTouchAction;
        };
    }, [isOpen]);

    const handleClose = () => {
        router.back(); // Нативный шаг назад в Next.js
    };

    const ContentComponent = cardId ? PAGE_REGISTRY[cardId] : null;

    return (
        /*
           🌟 МАГИЯ FRAMER MOTION: Анимация AnimatePresence теперь опирается на флаг isOpen,
           а не на физическое удаление компонента из DOM-дерева со стороны Next.js!
        */
        <AnimatePresence>
            {isOpen && cardId && (
                <motion.div
                    className={s.modalOverlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                >
                    {/*
                       Поскольку этот узел теперь имеет стабильную историю жизни в DOM,
                       Framer Motion сделает идеальный Cross-Fade из зеленого градиента в #09090b!
                    */}
                    <motion.div
                        layoutId={`card-bg-${cardId}`}
                        className={s.expandedCard}
                        onClick={(e) => e.stopPropagation()}
                        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                        style={{ backgroundColor: cardId === 'coding' ? '#1A2F2A' : '#09090b' }}
                    >
                        <button className={s.closeButton} onClick={handleClose}>✕</button>

                        <div className={s.contentWrapper}>
                            {cardId === 'vacancy' ? (
                                <VacancyList />
                            ) : ContentComponent ? (
                                <ContentComponent isOpen={true} />
                            ) : null}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
