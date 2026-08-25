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
}

export default function VacancyGrid({ vacancies, loading = false }: VacancyGridProps) {

    // Обработчик клика по карточке вакансии (копия твоей логики handleCardClick)
    const handleVacancyClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault(); // Прерываем переход, чтобы роутер Next.js не стирал DOM

        // Пушим маркер 'vacancy-modal' в историю, чтобы DoubleExitHandler не путался
        window.history.pushState({ type: 'vacancy-modal' }, '', `/vacancy/card/${id}`);

        // Генерируем кастомное событие, чтобы родительский VacancyList узнал об открытии шторки
        window.dispatchEvent(new CustomEvent('open-vacancy-sheet', { detail: id }));
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
        <motion.div key="list" className={s.listGrid} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {vacancies.map((vacancy, index) => (
                <Link
                    key={vacancy.id || index}
                    href={`/vacancy/card/${vacancy.id}`} // Чистый URL для поисковых роботов (SEO)
                    onClick={(e) => handleVacancyClick(e, String(vacancy.id))} // Перехват для живых людей
                    scroll={false}
                    className={s.vacancyCardLink}
                >
                    <motion.div
                        className={s.vacancyCard}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 + 0.05, duration: 0.25, ease: "easeOut" }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
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
                                <div className={s.details}>
                                    <div className={s.WatchVacancy}>▶</div>
                                    <div className={s.dateWrapper}>{vacancy.date}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </Link>
            ))}
        </motion.div>
    );
}
