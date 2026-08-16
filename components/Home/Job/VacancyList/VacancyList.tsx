// components/Home/Job/VacancyList/VacancyList.tsx
'use client';

import React, { useEffect } from "react";
import s from './VacancyList.module.css';
import { motion, AnimatePresence } from "framer-motion";
import VacancyGrid from "./VacancyGrid";
import { useVacancies } from "@/hooks/useVacancies";

/**
 * Автономный компонент списка вакансий (VacancyList)
 * 100% декларативный, легкий и полностью очищенный от дублирующих стейтов.
 */
export default function VacancyList() {
    const { vacancies, loading, error, handleRetry } = useVacancies();

    // Синхронизация темы оформления (ваша оригинальная логика)
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    return (
        <motion.div className={s.contentWrapper}>
            <div className={s.vacancyList}>
                <AnimatePresence mode="wait">

                    {loading && (
                        <VacancyGrid vacancies={[]} loading={true} />
                    )}

                    {!loading && error && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className={s.errorBlock}
                        >
                            <div className={s.errorIcon}>{error.type === 'network' ? '🌐' : '⚠️'}</div>
                            <h4 className={s.errorTitle}>{error.type === 'network' ? 'Проблема с соединением' : 'Ошибка сервера'}</h4>
                            <p className={s.errorText}>{error.message}</p>
                            <button className={s.retryButton} onClick={handleRetry}>Повторить попытку</button>
                        </motion.div>
                    )}

                    {!loading && !error && vacancies.length === 0 && (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={s.noVacancies}>
                            Список вакансий пуст
                        </motion.div>
                    )}

                    {!loading && !error && vacancies.length > 0 && (
                        /*
                           🌟 СЕНЬОР-ФИКС: Мы убрали onCardClick.
                           Выделенный файл VacancyGrid принимает только массив vacancies.
                        */
                        <VacancyGrid vacancies={vacancies} />
                    )}

                </AnimatePresence>
            </div>
        </motion.div>
    );
}
