'use client';

import React, { useEffect, useMemo } from "react";
import s from '@/components/Home/Job/VacancyList/VacancyList.module.css';
import { motion, AnimatePresence } from "framer-motion";
import VacancyInfo from "@/components/Home/Job/VacancyInfo/VacancyInfo";
import VacancyGrid from "./VacancyGrid";
import { useVacancies } from "@/hooks/useVacancies";

export interface VacancyListProps {
    // 🌟 СЕНЬОР-ФИКС: Больше никаких локальных стейтов и старых хуков.
    // Данные роутинга приходят из единого источника правды (Main -> SpecialPromoCard -> VacancyList)
    activeVacancyId: string | null;
    setActiveVacancyId: (id: string | null) => void;
}

export default function VacancyList({ activeVacancyId, setActiveVacancyId }: VacancyListProps) {
    const { vacancies, loading, error, handleRetry } = useVacancies();

    // Синхронизация темы оформления (ваша оригинальная логика)
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    // Поиск выбранной вакансии для передачи в шторку VacancyInfo
    const selectedVacancy = useMemo(() => {
        if (!activeVacancyId) return null;
        return vacancies.find(v => String(v.id) === activeVacancyId) || null;
    }, [activeVacancyId, vacancies]);

    const isVacancyOpen = Boolean(selectedVacancy);

    return (
        <motion.div
            className={s.contentWrapper}
            animate={{
                // Красивый эффект уменьшения контента списка, когда поверх открывается карточка VacancyInfo
                scale: isVacancyOpen ? 0.95 : 1,
                y: isVacancyOpen ? "-10px" : "0px",
                // borderRadius: isVacancyOpen ? "24px" : "0px",
            }}
            transition={{ type: "spring", damping: 30, stiffness: 240 }}
        >
            <div className={s.vacancyList}>
                <AnimatePresence mode="wait">

                    {loading && (
                        <VacancyGrid vacancies={[]} onCardClick={() => {}} loading={true} />
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
                        <VacancyGrid
                            vacancies={vacancies}
                            // При клике на карточку прокидываем ID в глобальный роутинг
                            onCardClick={(vacancy) => setActiveVacancyId(String(vacancy.id))}
                        />
                    )}

                </AnimatePresence>
            </div>

            {/* Шторка детальной информации о вакансии (уровень 2) */}
            <AnimatePresence>
                {isVacancyOpen && selectedVacancy && (
                    <VacancyInfo
                        vacancy={selectedVacancy}
                        onClose={() => setActiveVacancyId(null)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
