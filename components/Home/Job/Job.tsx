// components/Home/Job/Job.tsx
'use client';

import React from "react";
import { motion } from 'framer-motion'; // Добавили для анимации тапа
import Lottie from 'lottie-react';
import tapAnimation from '@/public/lottie/business-analysis1.json';
import s from "@/components/Home/Job/Job.module.css";

// Описываем тип пропса для клика
interface JobProps {
    onClick?: () => void;
}

export default function Job({ onClick }: JobProps) {
    return (
        /*
          1. Обернули в motion.div, добавили уникальный layoutId="job".
          2. Повесили обработчик onClick, который прилетит из HomeGridClient.
          3. Добавили эффект whileTap для приятного мобильного отклика (микро-сжатие при нажатии).
        */
        <motion.div
            layoutId="job"
            className={s.Job}
            onClick={onClick}
            role="button"
            tabIndex={0}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.45 }}
            style={{ cursor: 'pointer' }}
        >
            <div className={s.Content}>
                {/* Раскомментировал и исправил названия, чтобы текст был читаемым */}
                <div className={s.Left}>
                    <div className={s.Title}>Вакансии</div>
                    <div className={s.SearchJob}>Смотреть вакансии</div>
                </div>
                <div className={s.Right}>
                    <div className={s.WorkImg}>
                        <Lottie animationData={tapAnimation} loop={true} autoplay={true}/>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
