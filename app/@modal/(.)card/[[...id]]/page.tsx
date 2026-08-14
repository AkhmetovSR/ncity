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
import { PAGE_REGISTRY } from "@/app/cards"; // Импортируем ваш реестр страниц
import s from '@/app/page.module.css'; // Используем ваши родные стили приложения

interface Props {
    params: Promise<{ id?: string[] }>;
}

/**
 * Перехватчик маршрутов (Intercepting Route) для параллельного слота @modal.
 *
 * Работает как единственная инстанция рендеринга модального окна на главной.
 * Полностью исключает конфликт двойных монтирований и наложений фонов.
 */
export default function ModalCardCatchAllPage({ params }: Props) {
    // Безопасно разворачиваем асинхронные параметры роутера Next.js
    const resolvedParams = use(params);
    const pathSegments = resolvedParams.id || [];

    // Сегмент 0 — ID карточки ('vacancy', 'travel', 'coding', 'A', 'B')
    const cardId = pathSegments[0] || null;

    // Локальный стейт для управления вложенной вакансией внутри модального списка
    const [activeVacancyId, setActiveVacancyId] = useState<string | null>(pathSegments[1] || null);

    // Валидация разрешенных идентификаторов карточек для защиты от рендеринга мусора
    const validIds = ['vacancy', 'travel', 'coding', 'A', 'B'];
    if (cardId && !validIds.includes(cardId)) {
        return null; // Игнорируем рендер модалки для невалидных роутов
    }

    /**
     * Закрытие через нативную имитацию системной кнопки "Назад".
     * Браузер стирает URL, Next.js убирает параллельный слот, а карточки возвращают видимость.
     */
    const handleClose = () => {
        if (typeof window !== 'undefined') {
            window.history.back(); // Имитируем системную кнопку "Назад"
        }
    };

    // Динамически достаем нужный компонент страницы из вашего PAGE_REGISTRY
    const ContentComponent = cardId ? PAGE_REGISTRY[cardId] : null;

    return (
        <>
            {/* Жестко блокируем жесты скролла подложки в iOS Safari, пока открыто окно */}
            <style dangerouslySetInnerHTML={{ __html: `body { overflow: hidden; touch-action: none; }` }} />

            {/*
              Прозрачный фиксированный контейнер для центрирования.
              Клик по пустой области вокруг карточки нативно закроет модалку.
            */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                }}
                onClick={handleClose}
            >
                {/*
                  Коробка модального окна.
                  🌟 layoutId строго синхронизирован с `card-bg-${cardId}` из GridCard и SpecialPromoCard.
                  Задаем коробке базовый цвет фона: для раздела 'coding' это глубокий зеленый #1A2F2A,
                  а для вакансий или дефолтных страниц — черный #09090b.
                  Framer Motion берет цвет/градиент исходного виджета и плавно переливает его в этот фон модалки.
                */}
                <motion.div
                    layoutId={`card-bg-${cardId}`}
                    className={s.expandedCard}
                    onClick={(e) => e.stopPropagation()} // Защита от закрытия при клике на контент внутри окна
                    transition={{ type: 'spring', stiffness: 220, damping: 26 }} // Родная пружина, как в GridCard
                    style={{
                        position: 'relative',
                        display: 'block',
                        borderRadius: '24px', // Синхронизируем скругление с вашей cardBase
                        overflow: 'hidden',   // Прячем острые края контента во время деформации пружины
                        backgroundColor: cardId === 'coding' ? '#1A2F2A' : '#09090b'
                    }}
                >
                    {/* Ваша верхняя нативная кнопка-крестик для закрытия */}
                    <button className={s.closeButton} onClick={handleClose}>
                        ✕
                    </button>

                    {/* Ваш контейнер контента */}
                    <div className={s.contentWrapper}>
                        {/* Внутреннее содержимое плавно проявляется после раскрытия геометрии */}
                        {/*<motion.div*/}
                        {/*    initial={{ opacity: 0 }}*/}
                        {/*    animate={{ opacity: 1, transition: { delay: 0.1 } }}*/}
                        {/*    exit={{ opacity: 0 }}*/}
                        {/*    style={{ height: '100%', width: '100%' }}*/}
                        {/*>*/}
                        {/*    {cardId === 'vacancy' ? (*/}
                        {/*        <VacancyList*/}
                        {/*            activeVacancyId={activeVacancyId}*/}
                        {/*            setActiveVacancyId={setActiveVacancyId}*/}
                        {/*        />*/}
                        {/*    ) : ContentComponent ? (*/}

                        {/*        <ContentComponent isOpen={true} />*/}
                        {/*    ) : (*/}
                        {/*        <div style={{ padding: '1rem', color: '#6b7280' }}>*/}
                        {/*            Раздел {cardId}*/}
                        {/*        </div>*/}
                        {/*    )}*/}
                        {/*</motion.div>*/}
                    </div>
                </motion.div>
            </div>
        </>
    );
}
