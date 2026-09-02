// // components/Home/Job/VacancyList/VacancyList.tsx
// 'use client';
//
// import { useState, useEffect, useRef } from 'react'; // 🌟 Добавили useRef
// import { motion, AnimatePresence } from "framer-motion";
// import VacancyGrid from "./VacancyGrid";
// import VacancySheet from "./VacancySheet";
// import VacancyCardContent from "./VacancyCardContent";
// // 🌟 Не забудьте обновить путь импорта хука, если перенесли его в папку vacancy
// import { useVacancies } from "@/app/vacancy/_hooks/useVacancies";
// import s from '@/app/vacancy/_components/VacancyList.module.css';
//
// export interface VacancyListProps {
//     initialVacancyId: string;
// }
//
// export default function VacancyList({ initialVacancyId }: VacancyListProps) {
//     // 🌟 Достаем новые переменные для бесконечного скролла из нашего хука
//     const { vacancies, loading, loadingMore, hasMore, loadMore, error } = useVacancies();
//     const [activeVacancyId, setActiveVacancyId] = useState<string>(initialVacancyId);
//
//     // Ссылка на элемент-маяк внизу страницы
//     const triggerRef = useRef<HTMLDivElement | null>(null);
//
//     // 🌟 ЭФФЕКТ БЕСКОНЕЧНОГО СКРОЛЛА (Intersection Observer)
//     useEffect(() => {
//         if (loading || !hasMore) return;
//
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 // Если маяк появился в зоне видимости — подгружаем данные
//                 if (entries[0].isIntersecting) {
//                     loadMore();
//                 }
//             },
//             {
//                 rootMargin: '200px', // Начинаем загрузку за 200px до того, как пользователь доскроллит до самого низа
//                 threshold: 0.1
//             }
//         );
//
//         if (triggerRef.current) {
//             observer.observe(triggerRef.current);
//         }
//
//         return () => observer.disconnect();
//     }, [loading, hasMore, loadMore]);
//
//     // СИНХРОНИЗАЦИЯ С ИСТОРИЕЙ (оставляем вашу логику без изменений)
//     useEffect(() => {
//         if (initialVacancyId) {
//             window.history.replaceState({ type: 'direct-vacancy-modal' }, '');
//         }
//
//         const handlePopState = () => {
//             const pathname = window.location.pathname;
//             const isBaseVacancyRoute = pathname === '/vacancy' || pathname === '/vacancy/';
//
//             if (isBaseVacancyRoute) {
//                 setActiveVacancyId('');
//             } else {
//                 const pathParts = pathname.split('/');
//                 const vacancyId = pathParts[pathParts.length - 1];
//                 if (vacancyId) setActiveVacancyId(vacancyId);
//             }
//         };
//
//         window.addEventListener('popstate', handlePopState);
//         return () => window.removeEventListener('popstate', handlePopState);
//     }, [initialVacancyId]);
//
//     return (
//         <motion.div className={s.contentWrapper}>
//             <div className={s.vacancyList}>
//                 <AnimatePresence>
//                     {loading && (
//                         <VacancyGrid vacancies={[]} loading={true} onVacancyClick={() => {}} />
//                     )}
//
//                     {!loading && !error && vacancies.length > 0 && (
//                         <>
//                             <VacancyGrid
//                                 vacancies={vacancies}
//                                 onVacancyClick={(id) => setActiveVacancyId(id)}
//                             />
//
//                             {/* 🌟 ЭЛЕМЕНТ-МАЯК ДЛЯ АВТОМАТИЧЕСКОЙ ПОДГРУЗКИ */}
//                             <div ref={triggerRef} className={s.scrollTrigger}>
//                                 {loadingMore && (
//                                     // Небольшой аккуратный лоадер/скелетон снизу при дозагрузке
//                                     <div className={s.miniLoader}>Загрузка следующих вакансий...</div>
//                                 )}
//                             </div>
//                         </>
//                     )}
//                 </AnimatePresence>
//             </div>
//
//             <AnimatePresence>
//                 {activeVacancyId && (
//                     <VacancySheet
//                         key={activeVacancyId}
//                         id={activeVacancyId}
//                         onClose={() => setActiveVacancyId('')}
//                     >
//                         <VacancyCardContent id={activeVacancyId} />
//                     </VacancySheet>
//                 )}
//             </AnimatePresence>
//         </motion.div>
//     );
// }

// app/vacancy/_components/VacancyList.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import VacancyGrid from "./VacancyGrid";
import VacancySheet from "./VacancySheet";
import VacancyCardContent from "./VacancyCardContent";
import VacancyForm from "./VacancyForm"; // 🌟 СЕНЬОР-ФИКС: Импортируем нашу форму
import { useVacancies } from "@/app/vacancy/_hooks/useVacancies";
import s from './VacancyList.module.css';
import fs from './VacancyForm.module.css'; // 🌟 Импортируем стили кнопки формы

export interface VacancyListProps {
    initialVacancyId: string;
}

export default function VacancyList({ initialVacancyId }: VacancyListProps) {
    const { vacancies, loading, loadingMore, hasMore, loadMore, error } = useVacancies();
    const [activeVacancyId, setActiveVacancyId] = useState<string>(initialVacancyId);

    // 🌟 СЕНЬОР-ФИКС: Стейт для открытия/закрытия формы добавления вакансии
    const [isFormOpen, setIsFormOpen] = useState(false);

    const triggerRef = useRef<HTMLDivElement | null>(null);

    // Автоматическая подгрузка порций по 50 штук при скролле
    // Автоматическая подгрузка порций по 50 штук при скролле
    useEffect(() => {
        if (loading || !hasMore) return;

        // 🌟 СЕНЬОР-ФИКС: Явно типизируем entries как массив IntersectionObserverEntry
        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]) => {
                const [entry] = entries; // Достаем первый элемент массива

                if (entry && entry.isIntersecting) {
                    loadMore(); // Если маяк виден — запускаем подгрузку
                }
            },
            { rootMargin: '200px', threshold: 0.1 }
        );

        if (triggerRef.current) observer.observe(triggerRef.current);
        return () => observer.disconnect();
    }, [loading, hasMore, loadMore]);

    // Синхронизация шторки с историей браузера
    useEffect(() => {
        if (initialVacancyId) {
            window.history.replaceState({ type: 'direct-vacancy-modal' }, '');
        }

        const handlePopState = () => {
            const pathname = window.location.pathname;
            const isBaseVacancyRoute = pathname === '/vacancy' || pathname === '/vacancy/';
            const urlParams = new URLSearchParams(window.location.search);

            // Проверяем, убрал ли браузер параметр формы из URL
            if (!urlParams.has('add')) {
                setIsFormOpen(false);
            }

            if (isBaseVacancyRoute) {
                setActiveVacancyId('');
            } else {
                const pathParts = pathname.split('/');
                const vacancyId = pathParts[pathParts.length - 1];
                if (vacancyId) setActiveVacancyId(vacancyId);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [initialVacancyId]);

    return (
        <motion.div className={s.contentWrapper}>
            <h2 className={s.Title}>Вакансии</h2>
            {/* 🌟 СЕНЬОР-ФИКС: Плавающая кнопка "+" для добавления вакансии */}
            <button
                className={fs.addButton}
                onClick={() => {
                    setIsFormOpen(true);
                    try {
                        // Добавляем параметр ?add=true в историю, чтобы "Назад" знала о форме
                        window.history.pushState({ type: 'vacancy-form' }, '', `${window.location.pathname}?add=true`);
                    } catch (e) {
                        console.warn(e);
                    }
                }}
                title="Добавить вакансию"
            >
                +
            </button>

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
                        <VacancyCardContent id={activeVacancyId} />
                    </VacancySheet>
                )}
            </AnimatePresence>

            {/* 🌟 СЕНЬОР-ФИКС: Модальное окно формы добавления */}
            <VacancyForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
            />
        </motion.div>
    );
}
