// // components/Home/Job/VacancyList/VacancyList.tsx
// 'use client';
//
// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from "framer-motion";
// import VacancyGrid from "./VacancyGrid";
// import VacancySheet from "./VacancySheet";
// import VacancyCardContent from "./VacancyCardContent";
// import { useVacancies } from "@/app/vacancy/_hooks/useVacancies";
// import s from '@/components/Home/Job/VacancyList/VacancyList.module.css';
//
// // чтобы реестр страниц мог его прочитать и типизировать!
// export interface VacancyListProps {
//     initialVacancyId: string;
// }
//
// export default function VacancyList({ initialVacancyId }: VacancyListProps) {
//     const { vacancies, loading, error, handleRetry } = useVacancies();
//     const [activeVacancyId, setActiveVacancyId] = useState<string>(initialVacancyId);
//
//     // 🌟 СИНХРОНИЗАЦИЯ С ИСТОРИЕЙ (ПОЛНАЯ СИММЕТРИЯ ТВОЕЙ ГЛАВНОЙ)
//     useEffect(() => {
//         if (initialVacancyId) {
//             window.history.replaceState({ type: 'direct-vacancy-modal' }, '');
//         }
//
//         const handlePopState = () => {
//             const pathname = window.location.pathname;
//             // Если вернулись на корень раздела вакансий
//             const isBaseVacancyRoute = pathname === '/vacancy' || pathname === '/vacancy/';
//
//             if (isBaseVacancyRoute) {
//                 setActiveVacancyId(''); // Закрываем шторку
//             } else {
//                 // Если перемещаемся по истории вперед-назад между вакансиями
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
//                 <AnimatePresence mode="wait">
//                     {loading && (
//                         // Прокидываем пустую функцию в скелетоны, чтобы типы не ругались
//                         <VacancyGrid vacancies={[]} loading={true} onVacancyClick={() => {}} />
//                     )}
//
//                     {!loading && !error && vacancies.length > 0 && (
//                         // 🌟 ВОТ ОНА АНАЛОГИЯ: передаем функцию изменения стейта прямо в грид
//                         <VacancyGrid
//                             vacancies={vacancies}
//                             onVacancyClick={(id) => setActiveVacancyId(id)}
//                         />
//                     )}
//                 </AnimatePresence>
//             </div>
//
//             {/* Шторка анимируется через AnimatePresence на основе стейта activeVacancyId */}
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

// components/Home/Job/VacancyList/VacancyList.tsx
'use client';

import { useState, useEffect, useRef } from 'react'; // 🌟 Добавили useRef
import { motion, AnimatePresence } from "framer-motion";
import VacancyGrid from "./VacancyGrid";
import VacancySheet from "./VacancySheet";
import VacancyCardContent from "./VacancyCardContent";
// 🌟 Не забудьте обновить путь импорта хука, если перенесли его в папку vacancy
import { useVacancies } from "@/app/vacancy/_hooks/useVacancies";
import s from '@/components/Home/Job/VacancyList/VacancyList.module.css';

export interface VacancyListProps {
    initialVacancyId: string;
}

export default function VacancyList({ initialVacancyId }: VacancyListProps) {
    // 🌟 Достаем новые переменные для бесконечного скролла из нашего хука
    const { vacancies, loading, loadingMore, hasMore, loadMore, error } = useVacancies();
    const [activeVacancyId, setActiveVacancyId] = useState<string>(initialVacancyId);

    // Ссылка на элемент-маяк внизу страницы
    const triggerRef = useRef<HTMLDivElement | null>(null);

    // 🌟 ЭФФЕКТ БЕСКОНЕЧНОГО СКРОЛЛА (Intersection Observer)
    useEffect(() => {
        if (loading || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // Если маяк появился в зоне видимости — подгружаем данные
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            {
                rootMargin: '200px', // Начинаем загрузку за 200px до того, как пользователь доскроллит до самого низа
                threshold: 0.1
            }
        );

        if (triggerRef.current) {
            observer.observe(triggerRef.current);
        }

        return () => observer.disconnect();
    }, [loading, hasMore, loadMore]);

    // СИНХРОНИЗАЦИЯ С ИСТОРИЕЙ (оставляем вашу логику без изменений)
    useEffect(() => {
        if (initialVacancyId) {
            window.history.replaceState({ type: 'direct-vacancy-modal' }, '');
        }

        const handlePopState = () => {
            const pathname = window.location.pathname;
            const isBaseVacancyRoute = pathname === '/vacancy' || pathname === '/vacancy/';

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

                            {/* 🌟 ЭЛЕМЕНТ-МАЯК ДЛЯ АВТОМАТИЧЕСКОЙ ПОДГРУЗКИ */}
                            <div ref={triggerRef} className={s.scrollTrigger}>
                                {loadingMore && (
                                    // Небольшой аккуратный лоадер/скелетон снизу при дозагрузке
                                    <div className={s.miniLoader}>Загрузка следующих вакансий...</div>
                                )}
                            </div>
                        </>
                    )}
                </AnimatePresence>
            </div>

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
        </motion.div>
    );
}
