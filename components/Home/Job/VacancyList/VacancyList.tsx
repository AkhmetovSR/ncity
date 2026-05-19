'use client';
import s from './VacancyList.module.css';
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { useEffect, useState } from "react";
import VacancyInfo from "@/components/Home/Job/VacancyInfo/VacancyInfo";
import { Vacancy } from '@/types/vacancy'; // Импортируем общий тип

export default function VacancyList() {
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [loading, setLoading] = useState(true);
    const [vacancyOpen, setVacancyOpen] = useState(false);
    const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);

    // Функция для парсинга даты в формате DD.MM.YYYY
    function parseDate(dateStr: string): Date {
        const [day, month, year] = dateStr.split('.');
        return new Date(Number(year), Number(month) - 1, Number(day));
    }

    // Загрузка сортированных вакансий
    useEffect(() => {
        fetch('/api/vacancies')
            .then(res => res.json())
            .then((data: Vacancy[]) => {
                const sortedData = [...data].sort((a, b) => {
                    const dateA = parseDate(a.date);
                    const dateB = parseDate(b.date);
                    return dateB.getTime() - dateA.getTime();
                });
                setVacancies(sortedData);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <motion.div className={s.fullscreenOverlay} layoutId="vacancy">
                <div className={s.fullscreenContent}>
                    <div className={s.loading}>Загрузка...</div>
                </div>
            </motion.div>
        );
    }

    if (vacancies.length === 0) {
        return (
            <motion.div className={s.fullscreenOverlay} layoutId="vacancy">
                <div className={s.fullscreenContent}>
                    <div className={s.emptyContainer}>
                        <div className={s.empty}>
                            <p>Нет вакансий.</p>
                            <p className={s.hint}>Парсинг выполняется автоматически каждый день в 23:00</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div className={s.fullscreenOverlay} layoutId="vacancy" transition={{ duration: 0.3, ease: "easeOut", type: "tween" }}>
            <motion.div className={s.fullscreenContent} onClick={(e) => e.stopPropagation()}>
                <div className={s.contentWrapper}>
                    <Link href="/" className={s.closeButton}>✕</Link>
                    <div className={s.vacancyList}>
                        {vacancies.map((vacancy, index) => (
                            <motion.div key={index} className={s.vacancyCard} initial={{y: -30, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{delay: 0.2 + index / 10}}>
                                <div className={s.cardHeader}>
                                    <h3 className={s.profession}>📌 {vacancy.profession}</h3>
                                    <h5 className={s.salary}>🪙 {vacancy.salary}</h5>
                                </div>
                                <div className={s.details}>
                                    <button className={s.WatchVacancy} onClick={() => {setSelectedVacancy(vacancy);setVacancyOpen(true);}}>
                                        Посмотреть
                                    </button>
                                    <span className={s.date}>{vacancy.date}</span>
                                </div>
                                <div className={s.details}>

                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
            <AnimatePresence>
                {vacancyOpen && selectedVacancy && (<VacancyInfo vacancy={selectedVacancy} onClose={() => setVacancyOpen(false)}/>)}
            </AnimatePresence>
        </motion.div>
    );
}