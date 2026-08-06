'use client';

import React, { useEffect, useState, useMemo } from "react";
import s from '@/components/Home/Job/VacancyList/VacancyList.module.css';
import { motion, AnimatePresence } from "framer-motion";
import VacancyInfo from "@/components/Home/Job/VacancyInfo/VacancyInfo";
import VacancyGrid from "./VacancyGrid";
import { useVacancies } from "@/hooks/useVacancies";
import { useVacancyHistory } from "@/hooks/useVacancyHistory";


interface VacancyListProps {
    initialVacancyId?: string | null;
}

export default function VacancyList({ initialVacancyId = null }: VacancyListProps) {
    const { vacancies, loading, error, handleRetry } = useVacancies();

    const [activeVacancyId, setActiveVacancyId] = useState<string | null>(null);

    useVacancyHistory(activeVacancyId, setActiveVacancyId);

    useEffect(() => {
        if (initialVacancyId && vacancies.length > 0) {
            setActiveVacancyId(initialVacancyId);
        }
    }, [initialVacancyId, vacancies]);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const selectedVacancy = useMemo(() => {
        if (!activeVacancyId) return null;
        return vacancies.find(v => String(v.id) === activeVacancyId) || null;
    }, [activeVacancyId, vacancies]);

    const isVacancyOpen = Boolean(selectedVacancy);

    return (
        <motion.div
            className={s.contentWrapper}
            animate={{
                scale: isVacancyOpen ? 0.95 : 1,
                y: isVacancyOpen ? "-10px" : "0px",
                borderRadius: isVacancyOpen ? "24px" : "0px",
            }}
            transition={{ type: "spring", damping: 30, stiffness: 240 }}
            style={{
                transformOrigin: "top center",
                width: '100%',
                height: '100%',
                backgroundColor: '#000000',
                overflow: 'hidden',
                willChange: "transform, border-radius"
            }}
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
                            onCardClick={(vacancy) => setActiveVacancyId(String(vacancy.id))}
                        />
                    )}

                </AnimatePresence>
            </div>

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
