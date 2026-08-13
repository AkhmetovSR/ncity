// import React, { use } from 'react';
// import { notFound } from 'next/navigation';
// import pool from "@/lib/db"; // Пул подключений к PostgreSQL (Data Access Layer)
// import { Vacancy } from "@/types/vacancy";
// import Main from "@/components/Main/Main"; // Главная интерактивная оболочка (App Shell)
//
// // TypeScript-интерфейс для входящих пропсов роута Next.js App Router.
// // Двойные квадратные скобки [[...id]] означают Optional Catch-All.
// // Next.js поставляет параметры строго в виде массива строк (сегментов URL-пути).
// interface Props {
//     params: Promise<{ id?: string[] }>;
// }
//
// // ==========================================================================
// // 1. ДИНАМИЧЕСКАЯ ГЕНЕРАЦИЯ МЕТАДАННЫХ (Критически важно для SEO)
// // ==========================================================================
// /**
//  * Функция выполняется на сервере Next.js ПЕРЕД отправкой HTML в браузер.
//  * Специально перехватывает запросы поисковых роботов (Google, Яндекс),
//  * чтобы отдать им уникальные, кликабельные теги <title> и <meta> для каждой вакансии.
//  */
// export async function generateMetadata({ params }: Props) {
//     // В свежих версиях Next.js объект params является Promise, резолвим его через await
//     const resolvedParams = await params;
//     const pathSegments = resolvedParams.id || [];
//
//     const cardId = pathSegments[0];   // Первый сегмент пути, например: "vacancy" или "travel"
//     const vacancyId = pathSegments[1]; // Второй сегмент (динамический ID из базы данных), например: "123"
//
//     // Кейс: Поисковый робот зашел по прямой ссылке на конкретную вакансию (/card/vacancy/123)
//     if (cardId === 'vacancy' && vacancyId) {
//         try {
//             // Делаем точечный запрос в БД, чтобы вытащить название должности и организации
//             // Приводим vacancyId к числу через Number(), если ID в базе данных целочисленный (INT)
//             const { rows } = await pool.query<Vacancy>(
//                 "SELECT title AS profession, company_name AS organization FROM vacancies WHERE id = $1 AND is_active = TRUE",
//                 [Number(vacancyId)]
//             );
//             const vacancy = rows[0];
//
//             if (vacancy) {
//                 // Возвращаем уникальные SEO-теги. Робот Яндекса покажет это как красивый сниппет в выдаче
//                 return {
//                     title: `${vacancy.profession} в ${vacancy.organization} | Актуальные вакансии`,
//                     description: `Ознакомьтесь с условиями работы, требованиями и обязанностями для позиции: ${vacancy.profession}. Откликнуться прямо сейчас.`
//                 };
//             }
//         } catch (error) {
//             // В случае сбоя БД логируем ошибку, но не валим генерацию метаданных для страницы
//             console.error('[SEO_METADATA_ERROR]:', error);
//         }
//     }
//
//     // Дефолтный маппинг статических заголовков для основных разделов приложения
//     const titles: Record<string, string> = {
//         'travel': '5 Inspiring Apps for Your Next Trip',
//         'coding': 'Как верстают архитекторы интерфейсов',
//         'vacancy': 'Доступные вакансии'
//     };
//
//     const pageTitle = titles[cardId || ''] || 'Карточка';
//     return { title: `${pageTitle} | App Store` };
// }
//
// // ==========================================================================
// // 2. СЕРВЕРНЫЙ КОНТРОЛЛЕР СОСТОЯНИЯ (Server State Hydrator)
// // ==========================================================================
// /**
//  * Основной серверный компонент страницы. Выполняется строго на бэкенде.
//  * Он НЕ генерирует отдельную статическую верстку, а рендерит ВСЮ оболочку приложения (Main),
//  * предварительно прочитав глубокие URL-пути из адресной строки и пробросив их в виде стартовых стейтов.
//  *
//  * Паттерн: Isomorphic Shell Rehydration (Изоморфное восстановление оболочки).
//  */
// export default function CardCatchAllPage({ params }: Props) {
//     // Синхронно резолвим параметры роута внутри тела компонента через стандартный хук React `use()`
//     const resolvedParams = use(params);
//     const pathSegments = resolvedParams.id || [];
//
//     const cardId = pathSegments[0] || null;    // Базовый ID карточки ("vacancy", "travel")
//     const vacancyId = pathSegments[1] || null; // Динамический ID вакансии (если зашли глубоко), иначе null
//
//     // Валидация роутов: защищает приложение от ручного ввода хакерами или юзерами несуществующих путей в браузере
//     const validIds = ['vacancy', 'travel', 'coding', 'A', 'B'];
//     if (cardId && !validIds.includes(cardId)) {
//         notFound();
//     }
//
//     // 🌟 СЕНЬОР-МУВ: Мы изолируем системные типы страниц Next.js от бизнес-логики.
//     // Вызываем главный компонент Main, передавая туда прочитанные сервером ID.
//     // При первом же кадре рендеринга на клиенте React мгновенно восстановит точную копию окон,
//     // которая была открыта у пользователя до нажатия клавиши F5.
//     return (
//         <Main
//             initialActiveId={cardId}
//             initialVacancyId={vacancyId}
//         />
//     );
// }
// --------------------- VERCEL-------------------------------------------------------
// import React, { use } from 'react';
// import { notFound } from 'next/navigation';
// import { Vacancy } from "@/types/vacancy";
// import Main from "@/components/Main/Main";
//
// // 🌟 СЕНЬОР-ФИКС 1: Глобальный импорт pool УДАЛЕН отсюда, чтобы сборщик не падал!
//
// interface Props {
//     params: Promise<{ id?: string[] }>;
// }
//
// export async function generateMetadata({ params }: Props) {
//     const resolvedParams = await params;
//     const pathSegments = resolvedParams.id || [];
//
//     const cardId = pathSegments[0];
//     const vacancyId = pathSegments[1];
//
//     if (cardId === 'vacancy' && vacancyId) {
//         try {
//             // 🌟 СЕНЬОР-ФИКС 2: Динамический импорт пула БЕЗОПАСНО внутри try/catch.
//             // Теперь Next.js не упадет при чтении файла.
//             const dbModule = await import("@/lib/db");
//             const pool = dbModule.default;
//
//             if (pool) {
//                 const { rows } = await pool.query<Vacancy>(
//                     "SELECT title AS profession, company_name AS organization FROM vacancies WHERE id = $1 AND is_active = TRUE",
//                     [Number(vacancyId)]
//                 );
//                 const vacancy = rows[0];
//
//                 if (vacancy) {
//                     return {
//                         title: `${vacancy.profession} в ${vacancy.organization} | Актуальные вакансии`,
//                         description: `Ознакомьтесь с условиями работы, требованиями и обязанностями для позиции: ${vacancy.profession}. Откликнуться прямо сейчас.`
//                     };
//                 }
//             }
//         } catch (error) {
//             console.error('[SEO_METADATA_ERROR]:', error);
//         }
//     }
//
//     const titles: Record<string, string> = {
//         'travel': '5 Inspiring Apps for Your Next Trip',
//         'coding': 'Как верстают архитекторы интерфейсов',
//         'vacancy': 'Доступные вакансии'
//     };
//
//     const pageTitle = titles[cardId || ''] || 'Карточка';
//     return { title: `${pageTitle} | App Store` };
// }
//
// export default function CardCatchAllPage({ params }: Props) {
//     const resolvedParams = use(params);
//     const pathSegments = resolvedParams.id || [];
//
//     const cardId = pathSegments[0] || null;
//     const vacancyId = pathSegments[1] || null;
//
//     const validIds = ['vacancy', 'travel', 'coding', 'A', 'B'];
//     if (cardId && !validIds.includes(cardId)) {
//         notFound();
//     }
//
//     return (
//         <Main
//             initialActiveId={cardId}
//             initialVacancyId={vacancyId}
//         />
//     );
// }

// //app/card/[[...id]]/page.tsx
// 'use client';
//
// import React, { use, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';
// import s from '@/app/page.module.css'; // ИСПРАВЛЕНИЕ ИМПОРТА: Используем твои рабочие стили приложения
//
// interface Props {
//     params: Promise<{ id?: string[] }>;
// }
//
// export default function ModalCardCatchAllPage({ params }: Props) {
//     // Безопасно разворачиваем асинхронные параметры роута Next.js
//     const resolvedParams = use(params);
//     const pathSegments = resolvedParams.id || [];
//
//     // Вытаскиваем сегменты роута в точности, как в твоем основном файле
//     const cardId = pathSegments[0] || null;
//     const vacancyId = pathSegments[1] || null;
//
//     const router = useRouter();
//
//     // Локальный стейт для управления плавным закрытием во Framer Motion
//     const [mounted, setMounted] = useState(true);
//
//     // Валидация ID в точности по твоему списку
//     const validIds = ['vacancy', 'travel', 'coding', 'A', 'B'];
//     if (cardId && !validIds.includes(cardId)) {
//         return null;
//     }
//
//     const handleClose = () => {
//         setMounted(false); // Запускаем exit-анимацию
//     };
//
//     const onAnimationComplete = () => {
//         if (!mounted) {
//             // Возвращаем чистый URL главной страницы без дублей в истории браузера
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
//                     {/* Задний размытый фон (Оверлей) на чистом CSS, так как отдельного файла стилей нет */}
//                     <motion.div
//                         style={{
//                             position: 'fixed',
//                             inset: 0,
//                             backgroundColor: 'rgba(9, 9, 11, 0.4)',
//                             backdropFilter: 'blur(16px)',
//                             WebkitBackdropFilter: 'blur(16px)',
//                             zIndex: 9999,
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             padding: '1rem'
//                         }}
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         onClick={handleClose}
//                     >
//                         {/*
//                           Коробка модального окна.
//                           Используем твой родной класс s.expandedCard для сохранения дизайна!
//                         */}
//                         <motion.div
//                             layoutId={`card-bg-${cardId}`}
//                             className={s.expandedCard}
//                             onClick={(e) => e.stopPropagation()}
//                             transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//                             style={{ position: 'relative', display: 'block' }}
//                         >
//                             {/* Твоя кнопка закрытия */}
//                             <button className={s.closeButton} onClick={handleClose}>
//                                 ✕
//                             </button>
//
//                             {/* Твой контейнер контента */}
//                             <div className={s.contentWrapper}>
//                                 <div style={{ padding: '1rem 0' }}>
//                                     <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.025em' }}>
//                                         {cardId === 'vacancy' ? 'Детали вакансии' : `Раздел: ${cardId}`}
//                                     </h2>
//                                     <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
//                                         ID вакансии: {vacancyId || 'Общий список'}
//                                     </p>
//                                 </div>
//
//                                 {/* Внутреннее содержимое плавно проявляется после раскрытия геометрии */}
//                                 <motion.div
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1, transition: { delay: 0.12 } }}
//                                     exit={{ opacity: 0 }}
//                                     style={{ marginTop: '1rem' }}
//                                 >
//                                     <div style={{ padding: '1.5rem', background: '#f3f4f6', borderRadius: '1.5rem', color: '#1f2937' }}>
//                                         <h4>💼 Интеграция с базой данных успешна</h4>
//                                         <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', lineHeight: 1.5 }}>
//                                             Здесь рендерится контент для типа карточки <b>{cardId}</b>.
//                                             Параметры роутера Next.js перехвачены без перезагрузки основной страницы.
//                                         </p>
//                                     </div>
//                                 </motion.div>
//                             </div>
//                         </motion.div>
//                     </motion.div>
//                 </>
//             )}
//         </AnimatePresence>
//     );
// }

// app/card/[[...id]]/page.tsx

import React from 'react';
import { notFound } from 'next/navigation';
import Main from "@/components/Main/Main";

interface Props {
    // В Next.js App Router параметры маршрута на сервере являются Promise
    params: Promise<{ id?: string[] }>;
}

/**
 * Автоматическая генерация SEO-метаданных (Server-Side)
 * Срабатывает при прямом заходе (F5) или при шеринге ссылки в Telegram/VK.
 */
export async function generateMetadata({ params }: Props) {
    const resolvedParams = await params;
    const pathSegments = resolvedParams.id || [];
    const cardId = pathSegments[0] || 'vacancy';

    const titles: Record<string, string> = {
        vacancy: "Вакансии в Нягани — Работа и свежие объявления",
        travel: "Транспорт и туризм Нягань — Маршруты и гид",
        coding: "IT-разработка и обучение в Нягани",
        A: "Компания А — Информация и услуги",
        B: "Компания B — Информация и услуги",
    };

    return {
        title: titles[cardId] || "Информационный портал Нягань",
        description: `Актуальная информация и детальные данные по разделу ${cardId} в городе Нягань.`,
    };
}

/**
 * Изолированная страница карточки (Server Component)
 *
 * Обрабатывает ПРЯМЫЕ ЗАХОДЫ (F5) и переходы по внешним ссылкам.
 * Выполняет серверную валидацию и рендерит корневое ядро приложения,
 * инициализируя его открытым состоянием нужного раздела.
 */
export default async function HardRouteCardPage({ params }: Props) {
    // Безопасно дожидаемся разрешения параметров на сервере
    const resolvedParams = await params;
    const pathSegments = resolvedParams.id || [];

    // Извлекаем сегменты: 0 — ID карточки, 1 — ID конкретной вакансии
    const cardId = pathSegments[0] || null;
    const vacancyId = pathSegments[1] || null;

    // Список валидных идентификаторов для защиты от мусорных URL
    const validIds = ['vacancy', 'travel', 'coding', 'A', 'B'];

    if (cardId && !validIds.includes(cardId)) {
        // Если ID не существует в реестре, сервер сразу отдаст нативную 404 страницу
        notFound();
    }

    /*
      🌟 СЕНЬОР-АРХИТЕКТУРА:
      Здесь, на сервере, перед рендером вы можете сделать прямой SQL-запрос к PostgreSQL.
      Например: const data = await db.query('SELECT * FROM jobs WHERE id = $1', [vacancyId]);

      Затем мы передаем полученные initial-айдишники в компонент <Main />,
      чтобы клиентское PWA-приложение знало, в каком состоянии ему инициализироваться.
    */
    return (
        <Main
            initialActiveId={cardId}
            initialVacancyId={vacancyId}
        />
    );
}
