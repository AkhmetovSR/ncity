// app/vacancy/_components/VacancyList.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import VacancyGrid from "./VacancyGrid";
import VacancySheet from "./VacancySheet";
import VacancyContent from "./VacancyContent";
import VacancyForm from "./VacancyForm";
import { useVacancies } from "@/app/vacancy/_hooks/useVacancies";
import { useInfiniteScroll } from "@/app/vacancy/_hooks/useInfiniteScroll"; // 🌟 Импортируем хук скролла
import { useVacancyNavigation } from "@/app/vacancy/_hooks/useVacancyNavigation"; // 🌟 Импортируем хук навигации
import s from './VacancyList.module.css';
import fs from './VacancyForm.module.css';

export interface VacancyListProps {
    initialVacancyId: string;
}

export default function VacancyList({ initialVacancyId }: VacancyListProps) {
    const { vacancies, loading, loadingMore, hasMore, loadMore, error } = useVacancies();

    const [activeVacancyId, setActiveVacancyId] = useState<string>(initialVacancyId);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // 🌟 СЕНЬОР-ФИКС: Приведение типов к String решает проблему "данные отсутствуют" при несовпадении string/number
    const activeVacancy = vacancies.find(v => String(v.id) === String(activeVacancyId));

    // 🌟 СЕНЬОР-ФИКС: Инкапсулируем логику IntersectionObserver в кастомный хук
    const triggerRef = useInfiniteScroll({ loading, hasMore, loadMore });

    // 🌟 СЕНЬОР-ФИКС: Инкапсулируем логику истории браузера и URL в кастомный хук
    const { openFormWithHistory } = useVacancyNavigation({
        initialVacancyId,
        setActiveVacancyId,
        setIsFormOpen,
    });

    return (
        <motion.div className={s.contentWrapper}>
            <h2 className={s.Title}>Вакансии</h2>

            {/* Плавающая кнопка добавления вакансии */}
            <button
                className={fs.addButton}
                onClick={openFormWithHistory}
                title="Добавить вакансию"
            >
                +
            </button>

            {/* Список вакансий */}
            <div className={s.vacancyList}>
                <AnimatePresence>
                    {loading && (
                        <VacancyGrid vacancies={[]} loading={true} onVacancyClick={() => {}} />
                    )}

                    {!loading && !error && vacancies.length > 0 && (
                        <>
                            <VacancyGrid
                                vacancies={vacancies}
                                onVacancyClick={(id) => setActiveVacancyId(id)}
                            />

                            {/* Маяк (триггер) для подгрузки следующей пачки */}
                            <div ref={triggerRef} className={s.scrollTrigger}>
                                {loadingMore && (
                                    <div className={s.miniLoader}>Загрузка следующих вакансий...</div>
                                )}
                            </div>
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Шторка просмотра вакансии */}
            <AnimatePresence>
                {activeVacancyId && (
                    <VacancySheet
                        key={activeVacancyId}
                        id={activeVacancyId}
                        onClose={() => setActiveVacancyId('')}
                    >
                        {/* 🌟 СЕНЬОР-ФИКС: Передаем уже найденный выше activeVacancy без лишних повторных .find() */}
                        <VacancyContent vacancy={activeVacancy} />
                    </VacancySheet>
                )}
            </AnimatePresence>

            {/* Модальное окно формы добавления */}
            <VacancyForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
            />
        </motion.div>
    );
}
