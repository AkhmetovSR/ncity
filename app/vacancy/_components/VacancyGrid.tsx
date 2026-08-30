// components/Home/Job/VacancyList/VacancyGrid.tsx
'use client';

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Vacancy } from '@/types/vacancy';
import s from './VacancyList.module.css';

interface VacancyGridProps {
    vacancies: Vacancy[];
    loading?: boolean;
    // 🌟 СЕНЬОР-ФИКС: Передаем функцию изменения стейта из родителя, как на главной!
    onVacancyClick: (id: string) => void;
}

export default function VacancyGrid({ vacancies, loading = false, onVacancyClick }: VacancyGridProps) {

    // Обработчик клика по карточке вакансии (ТЕПЕРЬ ЭТО 100% КОПИЯ handleCardClick)
    const handleVacancyClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault(); // Прерываем переход, чтобы роутер Next.js не стирал DOM

        // 1. Мгновенно меняем стейт в родительском компоненте (без всяких кастомных событий!)
        onVacancyClick(id);

        // 2. Пушим маркер в историю один в один по твоей логике
        window.history.pushState({ type: 'vacancy-modal' }, '', `/vacancy/card/${id}`);
    };

    if (loading) {
        const skeletonArray = Array.from({ length: 4 });
        return (
            <div className={s.skeletonContainer}>
                {skeletonArray.map((_, index) => (
                    <div key={`skeleton-${index}`} className={s.skeletonCard} />
                ))}
            </div>
        );
    }

    return (
        <motion.div key="list" className={s.listGrid} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            {vacancies.map((vacancy, index) => (
                <Link
                    key={vacancy.id || index}
                    href={`/vacancy/card/${vacancy.id}`} // Чистый URL для поисковых роботов (SEO)
                    onClick={(e) => handleVacancyClick(e, String(vacancy.id))} // Перехват для живых людей
                    scroll={false}
                    className={s.vacancyCardLink}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                >
                    <motion.div
                        className={s.vacancyCard}
                        // initial={{ opacity: 0, y: 15 }}
                        // animate={{ opacity: 1, y: 0 }}
                        // transition={{ delay: index * 0.03 + 0.05, duration: 0.25, ease: "easeOut" }}
                        // whileHover={{ scale: 1.01 }}
                        // whileTap={{ scale: 0.98 }}
                    >
                        <div className={s.vacancyContent}>
                            <div className={s.cardHeader}>
                                <div className={s.Wrapper}>
                                    <div className={s.Wrapper1}>
                                        <div className={s.divIcon1}><div className={s.Icon1}>📌</div></div>
                                        <div><h3 className={s.profession}>{vacancy.profession}</h3></div>
                                    </div>
                                    <div className={s.Wrapper2}>
                                        <div className={s.divIcon2}><div className={s.Icon2}><div className={s.Ruble}>₽</div></div></div>
                                        <div>
                                            <h5 className={s.salary}>
                                                {vacancy.salary ? `${vacancy.salary} ₽` : 'Зарплата не указана'}
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                                {/*<div className={s.details}>*/}
                                    {/*<div className={s.WatchVacancy}>▶</div>*/}
                                    {/*<div className={s.dateWrapper}>{vacancy.date}</div>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </motion.div>
                </Link>
            ))}
        </motion.div>
    );
}
