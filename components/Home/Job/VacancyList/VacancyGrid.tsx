'use client';

import React from "react";
import { motion } from "framer-motion";
import { Vacancy } from '@/types/vacancy';
import s from '@/components/Home/Job/VacancyList/VacancyList.module.css';

// Расширяем интерфейс пропсов для поддержки состояния загрузки
interface VacancyGridProps {
    vacancies: Vacancy[];
    onCardClick: (vacancy: Vacancy) => void;
    loading?: boolean; // Флаг, определяющий, показывать скелетоны или реальные данные
}

/**
 * Презентационный компонент VacancyGrid (Apple iOS Style).
 * Унифицирован для отображения как скелетонов загрузки, так и реального списка вакансий.
 * Паттерн: Polymorphic Conditional Layout.
 */
export default function VacancyGrid({ vacancies, onCardClick, loading = false }: VacancyGridProps) {

    // Если включен режим загрузки, рендерим сетку переливающихся заглушек в стиле App Store
    if (loading) {
        // Создаем массив из 4-х элементов для заполнения видимой части экрана смартфона
        const skeletonArray = Array.from({ length: 4 });

        return (
            <div className={s.skeletonContainer}>
                {skeletonArray.map((_, index) => (
                    <div
                        // Использование index здесь безопасно, так как массив скелетонов статичен и не мутирует
                        key={`skeleton-${index}`}
                        className={s.skeletonCard}
                    />
                ))}
            </div>
        );
    }

    // Если данные загружены, но массив пуст, этот кейс обрабатывается в родительском VacancyList.
    // Здесь мы рендерим готовую анимированную сетку с данными.
    return (
        <motion.div
            key="list"
            className={s.listGrid}
            // Плавное появление всего контейнера списка (Fade-in эффект)
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            {vacancies.map((vacancy, index) => (
                <motion.div
                    key={vacancy.id || index}
                    className={s.vacancyCard}
                    // Передаем событие клика наверх в родительский компонент-контроллер
                    onClick={() => onCardClick(vacancy)}

                    // Эффект "водопада" (Staggered Animation) — карточки выезжают снизу вверх по очереди
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    // Микротайминги Apple: каждая следующая карточка появляется на 30мс позже предыдущей
                    transition={{ delay: index * 0.03 + 0.05, duration: 0.25, ease: "easeOut" }}

                    // Тактильный и визуальный фидбек Apple Design System
                    whileHover={{ scale: 1.01 }} // Мягкое увеличение при наведении (актуально для десктопов)
                    whileTap={{ scale: 0.98 }}   // Физический упругий прогиб вовнутрь при тапе (iOS эффект)
                >
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
                                <button
                                    className={s.WatchVacancy}
                                    onClick={(e) => {
                                        // КРИТИЧНО ДЛЯ UX: Изолируем клик по кнопке, останавливая всплытие (bubbling).
                                        // Без этого вызов handleCardClick сработал бы дважды, ломая анимацию шторки.
                                        e.stopPropagation();
                                        onCardClick(vacancy);
                                    }}
                                >
                                    ▶
                                </button>
                                <div className={s.dateWrapper}>{vacancy.date}</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
