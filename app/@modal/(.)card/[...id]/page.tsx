// // app/@modal/(.)card/{{...id]]/page.tsx
// 'use client';
//
// import React, { use, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';
// import s from '@/components/modal.module.css'; // Путь к твоим CSS Modules модалки
//
// interface Props {
//     params: Promise<{ id?: string[] }>;
// }
//
// export default function ModalCardCatchAllPage({ params }: Props) {
//     // Разворачиваем асинхронные параметры роутера Next.js
//     const resolvedParams = use(params);
//     const pathSegments = resolvedParams.id || [];
//
//     // Вытаскиваем сегменты роута в точности по твоей логике (id — это массив строк)
//     const cardId = pathSegments[0] || null;
//     const vacancyId = pathSegments[1] || null;
//
//     const router = useRouter();
//
//     // Локальный стейт для управления плавным закрытием во Framer Motion
//     const [mounted, setMounted] = useState(true);
//
//     // Полная копия твоей валидации ID
//     const validIds = ['vacancy', 'travel', 'coding', 'A', 'B'];
//     if (cardId && !validIds.includes(cardId)) {
//         return null; // Если ID невалидный, модалка не перехватывает роут
//     }
//
//     const handleClose = () => {
//         setMounted(false); // Запускаем exit-анимацию сжатия карточки
//     };
//
//     const onAnimationComplete = () => {
//         if (!mounted) {
//             // Очищаем адресную строку роутера, возвращая на главную '/'
//             // replace предотвращает бесконечные дубли в истории браузера
//             router.replace('/', { scroll: false });
//         }
//     };
//
//     return (
//         <AnimatePresence onExitComplete={onAnimationComplete}>
//             {mounted && (
//                 <>
//                     {/* Сеньор-фикс: Блокируем жесты скролла подложки в iOS Safari, пока открыто окно */}
//                     <style dangerouslySetInnerHTML={{ __html: `body { overflow: hidden; touch-action: none; }` }} />
//
//                     {/* Задний размытый фон (Оверлей) */}
//                     <motion.div
//                         className={s.overlay}
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         onClick={handleClose}
//                     >
//                         {/*
//                           Коробка модального окна.
//                           layoutId связывает ее с id нажатой карточки для эффекта расширения.
//                         */}
//                         <motion.div
//                             layoutId={`card-${cardId}`}
//                             className={s.modal}
//                             onClick={(e) => e.stopPropagation()}
//                             transition={{ type: 'spring', stiffness: 300, damping: 30 }} // Apple-style пружина
//                         >
//                             <div className={s.modalLayout}>
//                                 <div className={s.modalHeader}>
//                                     <h2 className={s.modalTitle}>
//                                         {cardId === 'vacancy' ? 'Детали вакансии' : `Карточка: ${cardId}`}
//                                     </h2>
//                                     <p className={s.modalDesc}>Идентификатор: {vacancyId || 'Общий раздел'}</p>
//                                 </div>
//
//                                 {/* Внутреннее содержимое плавно проявляется после раскрытия геометрии */}
//                                 <motion.div
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1, transition: { delay: 0.12 } }}
//                                     exit={{ opacity: 0 }}
//                                     className={s.dynamicContent}
//                                 >
//                                     <div style={{ padding: '1.5rem', background: '#f3f4f6', borderRadius: '1.5rem', color: '#1f2937' }}>
//                                         <h4>💼 Интеграция с базой данных успешна</h4>
//                                         <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', lineHeight: 1.5 }}>
//                                             Здесь ты отрендеришь контент для типа карточки <b>{cardId}</b>.
//                                             Если передан ID вакансии (<b>{vacancyId}</b>), сюда можно вставить компонент детального просмотра вакансии с откликом.
//                                         </p>
//                                     </div>
//                                 </motion.div>
//                             </div>
//
//                             <button onClick={handleClose} className={s.closeBtn}>
//                                 Закрыть окно
//                             </button>
//                         </motion.div>
//                     </motion.div>
//                 </>
//             )}
//         </AnimatePresence>
//     );
// }

// // app/@modal/(.)card/[...id]/page.tsx
// 'use client';
//
// import React, { use } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useRouter } from 'next/navigation'; // 🌟 Единственный инструмент навигации
// import VacancyList from "@/components/Home/Job/VacancyList/VacancyList";
// import VacancyInfo from "@/components/Home/Job/VacancyInfo/VacancyInfo";
// import { PAGE_REGISTRY } from "@/app/cards";
// import { useVacancies } from "@/hooks/useVacancies";
// import s from '@/app/page.module.css';
//
// interface Props {
//     params: Promise<{ id: string[] }>;
// }
//
// const VALID_CARD_IDS = new Set(['vacancy', 'travel', 'coding', 'A', 'B']);
//
// export default function ModalCardCatchAllPage({ params }: Props) {
//     const router = useRouter();
//     const resolvedParams = use(params);
//     const pathSegments = resolvedParams?.id || [];
//
//     const cardId = pathSegments[0] || null;
//     const vacancyId = pathSegments[1] || null;
//
//     const { vacancies } = useVacancies();
//
//     if (!cardId || !VALID_CARD_IDS.has(cardId)) return null;
//
//     const ContentComponent = PAGE_REGISTRY[cardId] || null;
//     const selectedVacancy = vacancies.find(v => String(v.id) === vacancyId) || null;
//     const isVacancyOpen = Boolean(selectedVacancy);
//
//     /**
//      * 🌟 ИСТИННЫЙ НАЦИОНАЛЬНЫЙ ФИКС:
//      * Функция делает ровно то же самое, что и кнопка "Назад" в браузере или свайп на смартфоне.
//      * Она отматывает историю переходов ровно на один шаг назад, декларативно убирая текущий UI-слой.
//      */
//     const handleNavigationBack = () => {
//         router.back();
//     };
//
//     return (
//         <>
//             <style dangerouslySetInnerHTML={{ __html: `body { overflow: hidden !important; touch-action: none !important; }` }} />
//
//             {/* Оверлей-подложка модалки (Уровень 1) */}
//             <motion.div
//                 className={s.modalOverlay}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 onClick={handleNavigationBack} // Клик по фону — это честный шаг назад
//             >
//                 <motion.div
//                     layoutId={`card-bg-${cardId}`}
//                     className={s.expandedCard}
//                     onClick={(e) => e.stopPropagation()} // Защита от закрытия при клике на контент
//                     transition={{ type: 'spring', stiffness: 220, damping: 26 }}
//                     style={{ backgroundColor: cardId === 'coding' ? '#1A2F2A' : '#09090b' }}
//                 >
//                     {/* Крестик закрытия всей модалки (Уровень 1) */}
//                     <button
//                         className={s.closeButton}
//                         onClick={handleNavigationBack} // Точный и нативный шаг назад
//                         aria-label="Закрыть модальное окно"
//                     >
//                         ✕
//                     </button>
//
//                     <div className={s.contentWrapper}>
//                         {/* Контент списка плавно сжимается, когда поверх выезжает шторка */}
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{
//                                 opacity: 1,
//                                 scale: isVacancyOpen ? 0.96 : 1,
//                                 y: isVacancyOpen ? "-8px" : "0px",
//                                 transition: { type: 'spring', damping: 25, stiffness: 200 }
//                             }}
//                         >
//                             {cardId === 'vacancy' ? (
//                                 <VacancyList />
//                             ) : ContentComponent ? (
//                                 <ContentComponent isOpen={true} />
//                             ) : null}
//                         </motion.div>
//                     </div>
//
//                     {/* Шторка вакансии (Уровень 2) */}
//                     <AnimatePresence>
//                         {isVacancyOpen && selectedVacancy && (
//                             <VacancyInfo vacancy={selectedVacancy}>
//                                 {/*
//                                    🌟 СЕНЬОР-АННИГИЛЯЦИЯ ДВОЙНОГО КЛИКА:
//                                    Крестик шторки теперь ТОЖЕ вызывает системный шаг назад (router.back()).
//                                    Когда вы закрываете шторку, она нативно стирается из истории. Стек чист.
//                                    Следующий клик по крестику модалки гарантированно закроет окно с первого тапа!
//                                 */}
//                                 <button
//                                     className={s.closeButton}
//                                     onClick={handleNavigationBack} // Закрываем шторку через нативный откат истории
//                                     aria-label="Закрыть шторку вакансии"
//                                 >
//                                     ✕
//                                 </button>
//                             </VacancyInfo>
//                         )}
//                     </AnimatePresence>
//                 </motion.div>
//             </motion.div>
//         </>
//     );
// }

// app/@modal/(.)card/[...id]/page.tsx
'use client';

import React, { use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import VacancyList from "@/components/Home/Job/VacancyList/VacancyList";
import VacancyInfo from "@/components/Home/Job/VacancyInfo/VacancyInfo";
import { PAGE_REGISTRY } from "@/app/cards";
import { useVacancies } from "@/hooks/useVacancies";
import s from '@/app/@modal/(.)card/[...id]/page.module.css';

interface Props {
    params: Promise<{ id: string[] }>;
}

const VALID_CARD_IDS = new Set(['vacancy', 'travel', 'coding', 'A', 'B']);

export default function ModalCardCatchAllPage({ params }: Props) {
    const router = useRouter();
    const resolvedParams = use(params);
    const pathSegments = resolvedParams?.id || [];

    const cardId = pathSegments[0] || null;
    const vacancyId = pathSegments[1] || null;

    const { vacancies } = useVacancies();

    if (!cardId || !VALID_CARD_IDS.has(cardId)) return null;

    const ContentComponent = PAGE_REGISTRY[cardId] || null;
    const selectedVacancy = vacancies.find(v => String(v.id) === vacancyId) || null;
    const isVacancyOpen = Boolean(selectedVacancy);

    const handleNavigationBack = () => {
        router.back();
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `body { overflow: hidden !important; touch-action: none !important; }` }} />

            {/* Оверлей-подложка модалки (Уровень 1) — РАБОТАЕТ ИДЕАЛЬНО, НЕ ТРОГАЕМ */}
            <motion.div
                className={s.modalOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleNavigationBack}
            >
                <motion.div
                    layoutId={`card-bg-${cardId}`}
                    className={s.expandedCard}
                    onClick={(e) => e.stopPropagation()}
                    transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                    style={{ backgroundColor: cardId === 'coding' ? '#1A2F2A' : '#09090b' }}
                >
                    {/* Крестик закрытия всей модалки */}
                    <button
                        className={s.closeButton}
                        onClick={handleNavigationBack}
                        aria-label="Закрыть модальное окно"
                    >
                        ✕
                    </button>

                    <div className={s.contentWrapper}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                scale: isVacancyOpen ? 0.96 : 1,
                                y: isVacancyOpen ? "-8px" : "0px",
                                transition: { type: 'spring', damping: 25, stiffness: 200 }
                            }}
                        >
                            {cardId === 'vacancy' ? (
                                <VacancyList />
                            ) : ContentComponent ? (
                                <ContentComponent isOpen={true} />
                            ) : null}
                        </motion.div>
                    </div>

                    {/* Шторка вакансии (Уровень 2) */}
                    <AnimatePresence>
                        {isVacancyOpen && selectedVacancy && (
                            /*
                               🌟 ИСТИННЫЙ СЕНЬОР-ФИКС АНИМАЦИИ ЗАКРЫТИЯ:
                               Мы добавили key={`vacancy-${vacancyId}`}. Это единственный каноничный способ
                               сообщить AnimatePresence, какой именно элемент сейчас исчезает из разметки.
                               Когда router.back() сотрет vacancyId, Framer Motion мгновенно перехватит
                               удаление узла, "заморозит" шторку в DOM и плавно уведет её вниз по её нативному exit-правилу.
                            */
                            <VacancyInfo
                                key={`vacancy-${vacancyId}`}
                                vacancy={selectedVacancy}
                            >
                                <button
                                    className={s.closeButton}
                                    onClick={handleNavigationBack}
                                    aria-label="Закрыть шторку вакансии"
                                >
                                    ✕
                                </button>
                            </VacancyInfo>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </>
    );
}
