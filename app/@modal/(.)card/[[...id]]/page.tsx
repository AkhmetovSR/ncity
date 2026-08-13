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

// app/@modal/(.)card/[[...id]]/page.tsx
'use client';

import React, { use, useState } from 'react';
import { motion } from 'framer-motion';
import VacancyList from "@/components/Home/Job/VacancyList/VacancyList";
import s from '@/app/page.module.css'; // Используем ваши родные стили приложения

interface Props {
    params: Promise<{ id?: string[] }>;
}

/**
 * Перехватчик маршрутов (Intercepting Route) для параллельного слота @modal.
 * Полностью нативный роутинг без ручного управления стейтами монтирования.
 */
export default function ModalCardCatchAllPage({ params }: Props) {
    const resolvedParams = use(params);
    const pathSegments = resolvedParams.id || [];
    const cardId = pathSegments[0] || null;

    // Локальный стейт для управления вложенной вакансией внутри модального списка
    const [activeVacancyId, setActiveVacancyId] = useState<string | null>(pathSegments[1] || null);

    const validIds = ['vacancy', 'travel', 'coding', 'A', 'B'];
    if (cardId && !validIds.includes(cardId)) {
        return null; // Игнорируем рендер модалки для невалидных роутов
    }

    /**
     * Закрытие через нативную имитацию системной кнопки "Назад".
     * Вызывает событие popstate, обеспечивая идентичное поведение с аппаратной кнопкой смартфона.
     */
    const handleClose = () => {
        if (typeof window !== 'undefined') {
            window.history.back();
        }
    };

    return (
        <>
            {/* Жестко блокируем жесты скролла подложки в iOS Safari, пока открыто окно */}
            <style dangerouslySetInnerHTML={{ __html: `body { overflow: hidden; touch-action: none; }` }} />

            {/* Оверлей-бэкдроп на инлайн-стилях, чтобы не задеть ваш CSS */}
            <motion.div
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(9, 9, 11, 0.4)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose} // Закрытие при клике по оверлею
            >
                {/*
                  Коробка окна.
                  Использует ваш родной класс s.expandedCard и синхронизированный layoutId.
                */}
                <motion.div
                    layoutId={`card-bg-${cardId}`}
                    className={s.expandedCard}
                    onClick={(e) => e.stopPropagation()} // Защита от закрытия при клике на контент
                    transition={{ type: 'spring', stiffness: 220, damping: 26 }} // Родная пружина, как в GridCard
                    style={{ position: 'relative', display: 'block' }}
                >
                    {/* Ваша кнопка закрытия */}
                    <button className={s.closeButton} onClick={handleClose}>
                        ✕
                    </button>

                    {/* Ваш контейнер контента */}
                    <div className={s.contentWrapper}>
                        {/* Контент плавно проявляется после раскрытия геометрии */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.12 } }}
                            exit={{ opacity: 0 }}
                            style={{ height: '100%', width: '100%' }}
                        >
                            {cardId === 'vacancy' ? (
                                <VacancyList
                                    activeVacancyId={activeVacancyId}
                                    setActiveVacancyId={setActiveVacancyId}
                                />
                            ) : (
                                <div style={{ padding: '1rem', color: '#6b7280' }}>
                                    Раздел {cardId}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
}
