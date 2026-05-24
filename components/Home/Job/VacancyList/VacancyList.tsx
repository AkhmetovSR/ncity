'use client';
import s from './VacancyList.module.css';
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { useEffect, useState, useRef, useCallback } from "react";
import VacancyInfo from "@/components/Home/Job/VacancyInfo/VacancyInfo";
import { Vacancy } from '@/types/vacancy';

export default function VacancyList() {
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [filteredVacancies, setFilteredVacancies] = useState<Vacancy[]>([]);
    const [loading, setLoading] = useState(true);
    const [vacancyOpen, setVacancyOpen] = useState(false);
    const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [sortBy, setSortBy] = useState<'date' | 'salary-asc' | 'salary-desc'>('date');
    const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

    const observerRef = useRef<IntersectionObserver | null>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    function parseDate(dateStr: string): Date {
        const [day, month, year] = dateStr.split('.');
        return new Date(Number(year), Number(month) - 1, Number(day));
    }

    function parseSalary(salaryStr: string): number {
        const numbers = salaryStr.match(/\d+/g);
        if (!numbers) return 0;
        const nums = numbers.map(Number);
        return nums.reduce((a, b) => a + b, 0) / nums.length;
    }

    const sortVacancies = useCallback((vacanciesList: Vacancy[]) => {
        const sorted = [...vacanciesList];
        switch (sortBy) {
            case 'date':
                return sorted.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
            case 'salary-asc':
                return sorted.sort((a, b) => parseSalary(a.salary) - parseSalary(b.salary));
            case 'salary-desc':
                return sorted.sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
            default:
                return sorted;
        }
    }, [sortBy]);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    useEffect(() => {
        fetch('/api/vacancies')
            .then(res => res.json())
            .then((data: Vacancy[]) => {
                const sortedData = sortVacancies(data);
                setVacancies(sortedData);
                setFilteredVacancies(sortedData);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (vacancies.length > 0) {
            setFilteredVacancies(sortVacancies(vacancies));
        }
    }, [sortBy, vacancies]);

    return (
        <motion.div
            className={s.fullscreenOverlay}
            layoutId="vacancy"
            transition={{duration: 0.3, ease: "easeOut", type: "tween", delay: 0}}
        >
            <motion.div className={s.fullscreenContent} onClick={(e) => e.stopPropagation()}>
                <motion.div className={s.contentWrapper} initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.2}}>
                    <div className={s.header}>
                        <select
                            className={s.filterSelect}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                        >
                            <option value="date">📅 По дате (новые)</option>
                            <option value="salary-asc">💰 По зарплате (возрастание)</option>
                            <option value="salary-desc">💰 По зарплате (убывание)</option>
                        </select>
                        <Link href="/" className={s.closeButton}>✕</Link>
                    </div>

                    <div className={s.vacancyList}>
                        {filteredVacancies.map((vacancy, index) => (
                            <motion.div
                                key={vacancy.id || index}
                                ref={el => { cardsRef.current[index] = el }}
                                data-index={index}
                                className={`${s.vacancyCard} ${visibleCards.has(index) ? s.vacancyCardVisible : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // setSelectedVacancy(vacancy.id);
                                    setVacancyOpen(true);
                                }}
                                initial={{opacity: 0, y: 30}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: index * 0.05, duration: 0.4}}
                                whileHover={{scale: 1.01}}
                                whileTap={{scale: 0.99}}
                            >
                                <div className={s.vacancyContent}>
                                    <div className={s.cardHeader}>
                                        <div className={s.Wrapper}>
                                            <div className={s.Wrapper1}>
                                                <div className={s.divIcon1}><div className={s.Icon1}>📌</div></div>
                                                <div><h3 className={s.profession}>{vacancy.profession}</h3></div>
                                            </div>
                                            <div className={s.Wrapper2}>
                                                <div className={s.divIcon2}><div className={s.Icon2}>🪙</div></div>
                                                <div><h5 className={s.salary}>{vacancy.salary} ₽</h5></div>
                                            </div>
                                        </div>
                                        <div className={s.details}>
                                            <motion.button
                                                className={s.WatchVacancy}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedVacancy(vacancy);
                                                    setVacancyOpen(true);
                                                }}
                                            >
                                                ▶
                                            </motion.button>
                                            <div className={s.dateWrapper}>{vacancy.date}</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>

            {/* МОДАЛЬНОЕ ОКНО С ДЕТАЛЯМИ ВАКАНСИИ */}
            <AnimatePresence mode="wait">
                {vacancyOpen && selectedVacancy && (
                    <VacancyInfo
                        key="vacancy-info"  // ВАЖНО: добавляем key для AnimatePresence
                        vacancy={selectedVacancy}
                        onClose={() => setVacancyOpen(false)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}