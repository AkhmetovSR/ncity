// components/Home/Job/VacancyList/VacancyList.tsx
'use client';

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // 🌟 СЕНЬОР-ФИКС: Нативное чтение query-параметров
import s from '@/components/Home/Job/VacancyList/VacancyList.module.css';
import { motion, AnimatePresence } from "framer-motion";
import VacancyInfo from "@/components/Home/Job/VacancyInfo/VacancyInfo";
import VacancyGrid from "./VacancyGrid";
import { useVacancies } from "@/hooks/useVacancies";

export default function VacancyList() { // 🌟 Больше никаких пропсов сверху! Компонент полностью автономен.
    const { vacancies, loading, error, handleRetry } = useVacancies();

    // 🌟 Нативно достаем ID вакансии из URL (?v=123)
    const searchParams = useSearchParams();
    const activeVacancyId = searchParams.get('v');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    // Поиск выбранной вакансии
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
            }}
            transition={{ type: "spring", damping: 30, stiffness: 240 }}
        >
            <div className={s.vacancyList}>
                <AnimatePresence mode="wait">
                    {loading && <VacancyGrid vacancies={[]} loading={true} />}

                    {!loading && error && (
                        <div className={s.errorBlock}>
                            <button className={s.retryButton} onClick={handleRetry}>Повторить</button>
                        </div>
                    )}

                    {!loading && !error && vacancies.length > 0 && (
                        <VacancyGrid vacancies={vacancies} />
                    )}
                </AnimatePresence>
            </div>

            {/* Шторка детальной информации о вакансии (уровень 2) */}
            <AnimatePresence>
                {isVacancyOpen && selectedVacancy && (
                    /*
                       🌟 СЕНЬОР-ФИКС ЗАКРЫТИЯ ШТОРКИ:
                       Просто убираем query-параметр из адресной строки, ведя ссылку на базовый роут модалки.
                       Next.js мгновенно и без перезагрузок уберет шторку, запустив плавный exit-эффект.
                    */
                    <VacancyInfo vacancy={selectedVacancy}>
                        <Link
                            href="/card/vacancy"
                            className={s.closeVacancyLink}
                            scroll={false}
                        >
                            ✕
                        </Link>
                    </VacancyInfo>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
