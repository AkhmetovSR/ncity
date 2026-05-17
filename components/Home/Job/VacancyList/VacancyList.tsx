'use client';
import s from './VacancyList.module.css';
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { useEffect, useState } from "react";
import VacancyInfo from "@/components/Home/Job/VacancyInfo/VacancyInfo";
interface Vacancy {
    page: number;
    profession: string;
    salary: string;
    district: string;
    organization: string;
    date: string;
    schedule: string;
    _id?: number;
}


export default function VacancyList() {
    const [vacancies, setVacancies] = useState<Vacancy[]>([]); // Явно указываем тип
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
                    return dateB.getTime() - dateA.getTime(); // От новых к старым
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
                        {vacancies.map((vacancy: any, index: number) => (
                            <div key={index} className={s.vacancyCard}>
                                <div className={s.cardHeader}>
                                    <h3 className={s.profession}>{vacancy.profession}</h3>
                                    <h5 className={s.salary}>{vacancy.salary}</h5>
                                </div>
                                <div className={s.details}>
                                    <button className={s.WatchVacancy} onClick={() => {setSelectedVacancy(vacancy); setVacancyOpen(true)}}>Посмотреть</button>
                                </div>
                                <div className={s.details}>
                                    <span className={s.date}>📅 {vacancy.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
            {vacancyOpen && <VacancyInfo vacancy={selectedVacancy}/>}
        </motion.div>
    );
}


{/*<span className={styles.organization}>🏢 {vacancy.organization}</span>*/}
{/*<span className={styles.district}>📍 {vacancy.district}</span>*/}