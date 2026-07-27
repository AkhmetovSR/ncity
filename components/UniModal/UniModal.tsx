'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import s from "@/components/UniModal/uniModal.module.css";

interface UniModalProps {
    readonly id: string;
    readonly children: React.ReactNode;
    readonly onClose: () => void;
}

export default function UniModal({ id, children, onClose }: UniModalProps) {
    // КРИТИЧЕСКИЙ СТЕЙТ: Показывает контент ТОЛЬКО после окончания полета коробки
    const [isAnimationDone, setIsAnimationDone] = useState(false);

    return (
        // AnimatePresence плавно растворяет черный фон (оверлей) при закрытии окна
        <AnimatePresence>
            <div className={s.UniModal} onClick={onClose}>
                <motion.div
                    layoutId={id} // Тот же ID, что и у карточки. Карточка физически растягивается сюда!
                    className={s.modalContent}
                    // onClick={(e) => e.stopPropagation()} // Клик по списку вакансий не закроет модалку
                    transition={{ type: "spring", stiffness: 220, damping: 26 }}
                    // СЕНЬОР-ФИКС СРЫВА АНИМАЦИИ:
                    // Сработает СТРОГО тогда, когда коробка полностью долетела и зафиксировалась.
                    // Только в этот момент мы переключим стейт в true.
                    onLayoutAnimationComplete={() => setIsAnimationDone(true)}
                >
                    {/*
                      Внутри летящего окна — полная изоляция контента.
                      Пока isAnimationDone === false, тяжелый VacancyList вообще НЕ рендерится
                      в DOM, не меняет высоту окна в процессе полета и не ломает математику пружины.
                      Как только приземлились — контент мягко растворяется (opacity 0 -> 1) за 200мс.
                    */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isAnimationDone ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isAnimationDone && children}
                    </motion.div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
