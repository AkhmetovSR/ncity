// components/Home/Job/VacancyList/VacancyGrid.tsx
'use client';

import React from "react";
import Link from "next/link"; // 🌟 СЕНЬОР-ФИКС: Переходим на нативный декларативный роутинг Next.js
import { motion } from "framer-motion";
import { Vacancy } from '@/types/vacancy';
import s from '@/components/Home/Job/VacancyList/VacancyList.module.css';

interface VacancyGridProps {
    vacancies: Vacancy[];
    loading?: boolean; // Флаг, определяющий, показывать скелетоны или реальные данные
}

/**
 * Презентационный компонент VacancyGrid (Apple iOS Style).
 *
 * 100% декларативный. Полностью очищен от пропсов-колбэков и императивных кликов.
 * Переведен на нативные ссылки Next.js для бесшовного управления вложенными путями.
 */
export default function VacancyGrid({ vacancies, loading = false }: VacancyGridProps) {

    // Если включен режим загрузки, рендерим сетку переливающихся заглушек в стиле App Store
    if (loading) {
        const skeletonArray = Array.from({ length: 4 });

        return (
            <div className={s.skeletonContainer}>
                {skeletonArray.map((_, index) => (
                    <div
                        key={`skeleton-${index}`}
                        className={s.skeletonCard}
                    />
                ))}
            </div>
        );
    }

    return (
        <motion.div
            key="list"
            className={s.listGrid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            {vacancies.map((vacancy, index) => (
                /*
                   🌟 СЕНЬОР-ФИКС: Оборачиваем карточку в нативный Next.js Link.
                   При тапе по карточке URL в браузере плавно переключится на /card/vacancy/123.
                   Компонент VacancyList поймает этот URL декларативно и откроет нужную шторку.
                */
                <Link
                    key={vacancy.id || index} // 🌟 KEY ПЕРЕНОСИТСЯ СЮДА
                    href={`/vacancy/${vacancy.id}`}
                    scroll={false}
                    className={s.vacancyCardLink}
                >
                    <motion.div className={s.vacancyCard}>
                        <div className={s.vacancyContent}>
                            <div className={s.cardHeader}>
                                <div className={s.Wrapper}>

                                    {/* Строка 1: Профессия / Должность */}
                                    <div className={s.Wrapper1}>
                                        <div className={s.divIcon1}>
                                            <div className={s.Icon1}>📌</div>
                                        </div>
                                        <div>
                                            <h3 className={s.profession}>{vacancy.profession}</h3>
                                        </div>
                                    </div>

                                    {/* Строка 2: Финансовые условия (Зарплата) */}
                                    <div className={s.Wrapper2}>
                                        <div className={s.divIcon2}>
                                            <div className={s.Icon2}>
                                                <div className={s.Ruble}>₽</div>
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className={s.salary}>
                                                {vacancy.salary ? `${vacancy.salary} ₽` : 'Зарплата не указана'}
                                            </h5>
                                        </div>
                                    </div>

                                </div>

                                {/* Нижняя сервисная панель карточки */}
                                <div className={s.details}>
                                    {/*
                                       🌟 СЕНЬОР-ФИКС КНОПКИ: Поскольку сама карточка теперь ссылка,
                                       кнопка превращается в обычный визуальный индикатор. Больше не нужны
                                       ручные e.stopPropagation() и JS-обработчики. Клик по кнопке нативно
                                       ведет туда же, куда и клик по карточке.
                                    */}
                                    <div className={s.WatchVacancy}>
                                        ▶
                                    </div>
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
