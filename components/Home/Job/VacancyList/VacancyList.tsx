// 'use client';
//
// import React, { useEffect, useState, useMemo } from "react";
// import s from '@/components/Home/Job/VacancyList/VacancyList.module.css';
// import { motion, AnimatePresence } from "framer-motion";
// import VacancyInfo from "@/components/Home/Job/VacancyInfo/VacancyInfo";
// import { Vacancy } from '@/types/vacancy';
//
// export default function VacancyList() {
//     const [vacancies, setVacancies] = useState<Vacancy[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [vacancyOpen, setVacancyOpen] = useState(false);
//     const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
//     const [sortBy, setSortBy] = useState<'date' | 'salary-asc' | 'salary-desc'>('date');
//
//     // 1. Вспомогательные функции парсинга (вынесены для чистоты кода)
//     const parseDate = (dateStr: string): Date => {
//         if (!dateStr) return new Date();
//         const [day, month, year] = dateStr.split('.');
//         return new Date(Number(year), Number(month) - 1, Number(day));
//     };
//
//     const parseSalary = (salary: any): number => {
//         if (typeof salary === 'number') return salary;
//         if (!salary) return 0;
//         const numbers = String(salary).match(/\d+/g);
//         if (!numbers) return 0;
//         const nums = numbers.map(Number);
//         return nums.reduce((a, b) => a + b, 0) / nums.length;
//     };
//
//     // 2. Асинхронный безопасный запрос данных (Server Data Fetching pattern)
//     useEffect(() => {
//         const controller = new AbortController();
//
//         fetch('/api/vacancies', { signal: controller.signal })
//             .then(res => res.json())
//             .then((data: Vacancy[]) => {
//                 setVacancies(data);
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 if (err.name !== 'AbortError') {
//                     console.error('Ошибка загрузки вакансий:', err);
//                     setLoading(false);
//                 }
//             });
//
//         return () => controller.abort();
//     }, []);
//
//     // 3. Синхронизация темы оформления
//     useEffect(() => {
//         const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
//         document.documentElement.setAttribute('data-theme', savedTheme);
//     }, []);
//
//     // 4. Senior Optimization: Сортировка на лету через useMemo (минус 1 стейт, минус лишние рендеры)
//     const processedVacancies = useMemo(() => {
//         const sorted = [...vacancies];
//         switch (sortBy) {
//             case 'date':
//                 return sorted.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
//             case 'salary-asc':
//                 return sorted.sort((a, b) => parseSalary(a.salary) - parseSalary(b.salary));
//             case 'salary-desc':
//                 return sorted.sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
//             default:
//                 return sorted;
//         }
//     }, [vacancies, sortBy]);
//
//     return (
//         <div className={s.contentWrapper}>
//             {/* Основной контейнер списка */}
//             <div className={s.vacancyList}>
//                 {loading ? (
//                     /* Стабилизирующий лоадер, который выталкивает высоту окна изнутри, не давая ему сжаться в полоску */
//                     <div style={{
//                         display: 'flex',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         minHeight: '320px',
//                         width: '100%',
//                         color: 'rgba(255, 255, 255, 0.6)',
//                         fontSize: '16px'
//                     }}>
//                         Загрузка вакансий...
//                     </div>
//                 ) : processedVacancies.length === 0 ? (
//                     <div className={s.noVacancies}>Список вакансий пуст</div>
//                 ) : (
//                     processedVacancies.map((vacancy, index) => (
//                         <motion.div
//                             key={vacancy.id || index}
//                             className={s.vacancyCard}
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 setSelectedVacancy(vacancy);
//                                 setVacancyOpen(true);
//                             }}
//                             /*
//                               Появление карточек сдвинуто по таймингу,
//                               чтобы они плавно "проявлялись" только после того,
//                               как сама коробка модального окна завершит анимацию раскрытия.
//                             */
//                             initial={{ opacity: 0, y: 15 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: index * 0.03 + 0.15, duration: 0.3 }}
//                             whileHover={{ scale: 1.01 }}
//                             whileTap={{ scale: 0.99 }}
//                         >
//                             <div className={s.vacancyContent}>
//                                 <div className={s.cardHeader}>
//                                     <div className={s.Wrapper}>
//                                         <div className={s.Wrapper1}>
//                                             <div className={s.divIcon1}>
//                                                 <div className={s.Icon1}>📌</div>
//                                             </div>
//                                             <div>
//                                                 <h3 className={s.profession}>{vacancy.profession}</h3>
//                                             </div>
//                                         </div>
//                                         <div className={s.Wrapper2}>
//                                             <div className={s.divIcon2}>
//                                                 <div className={s.Icon2}>
//                                                     <div className={s.Ruble}>₽</div>
//                                                 </div>
//                                             </div>
//                                             <div>
//                                                 <h5 className={s.salary}>
//                                                     {vacancy.salary ? `${vacancy.salary} ₽` : 'Зарплата не указана'}
//                                                 </h5>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className={s.details}>
//                                         <button
//                                             className={s.WatchVacancy}
//                                             onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 setSelectedVacancy(vacancy);
//                                                 setVacancyOpen(true);
//                                             }}
//                                         >
//                                             ▶
//                                         </button>
//                                         <div className={s.dateWrapper}>{vacancy.date}</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </motion.div>
//                     ))
//                 )}
//             </div>
//
//             {/* Вложенное модальное окно детальной информации о конкретной вакансии */}
//             <AnimatePresence mode="wait">
//                 {vacancyOpen && selectedVacancy && (
//                     <VacancyInfo
//                         key="vacancy-info"
//                         vacancy={selectedVacancy}
//                         onClose={() => setVacancyOpen(false)}
//                     />
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// }
