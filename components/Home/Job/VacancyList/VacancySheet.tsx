// components/Home/Job/VacancyList/VacancySheet.tsx
'use client';

import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // Импортируем роутер как в твоем контейнере модалки
import { motion } from "framer-motion";
import s from "./VacancySheet.module.css";

interface VacancySheetProps {
    id: string;                 // Передаем ID для сохранения структуры (аналог layoutId, если используешь)
    onClose: () => void;        // Функция сброса стейта в родительском компоненте
    children: React.ReactNode;  // div с контентом описания
}

export default function VacancySheet({ id, onClose, children }: VacancySheetProps) {
    const router = useRouter();

    // 🌟 ОДИН В ОДИН ТВОЯ БОЕВАЯ ЛОГИКА handleClose 🌟
    const handleClose = () => {
        // Проверяем, зашел ли пользователь на эту вакансию по прямой ссылке.
        // Ищем маркер 'direct-vacancy-modal', который мы записали в VacancyList.
        const isDirect = window.history.state?.type === 'direct-vacancy-modal';

        if (isDirect) {
            // КАНОН NEXT.JS: Если заход прямой из поисковика — делаем SPA-переход на базовый роут вакансий.
            // URL меняется на '/vacancy', а AnimatePresence в родительском компоненте запустит exit-анимацию.
            router.push('/vacancy');
            onClose();
        } else {
            // ОБЫЧНЫЙ ВАРИАНТ: Если кликнули внутри сайта — сначала уведомляем родительский стейт,
            // чтобы запустить плавную exit-анимацию свайпа вниз, а затем делаем шаг назад в истории.
            onClose();
            window.history.back();
        }
    };

    // Блокируем скролл страницы на фоне при монтировании шторки (iOS канон)
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Слушаем клавишу Escape для закрытия шторки физической клавиатурой (как в твоем коде)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);

    return (
        // Вся обертка рендерится внутри AnimatePresence родительского VacancyList
        <div className={s.overlay} onClick={handleClose}>

            {/* Плавный матовый задник Apple-style */}
            <motion.div
                className={s.backdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            />

            {/* Выезжающая шторка с каноничной упругой пружиной */}
            <motion.div
                className={s.sheet}
                onClick={(e) => e.stopPropagation()} // Клик внутри шторки не закроет её
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }} // Анимация плавного уезда вниз при срабатывании handleClose
                transition={{
                    type: "spring",
                    damping: 28,
                    stiffness: 240,
                    mass: 0.8
                }}
            >
                {/* Серая полоска сверху имитирует действие кнопки закрытия */}
                <div className={s.dragHandle} onClick={handleClose} />

                <div className={s.content}>
                    {children} {/* Рендерим переданный div с описанием */}

                    <button className={s.closeButton} onClick={handleClose}>
                        Закрыть
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
