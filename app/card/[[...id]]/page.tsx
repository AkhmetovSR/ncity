import React, { use } from 'react';
import { notFound } from 'next/navigation';
import pool from "@/lib/db"; // Пул подключений к PostgreSQL (Data Access Layer)
import { Vacancy } from "@/types/vacancy";
import Main from "@/components/Main/Main"; // Главная интерактивная оболочка (App Shell)

// TypeScript-интерфейс для входящих пропсов роута Next.js App Router.
// Двойные квадратные скобки [[...id]] означают Optional Catch-All.
// Next.js поставляет параметры строго в виде массива строк (сегментов URL-пути).
interface Props {
    params: Promise<{ id?: string[] }>;
}

// ==========================================================================
// 1. ДИНАМИЧЕСКАЯ ГЕНЕРАЦИЯ МЕТАДАННЫХ (Критически важно для SEO)
// ==========================================================================
/**
 * Функция выполняется на сервере Next.js ПЕРЕД отправкой HTML в браузер.
 * Специально перехватывает запросы поисковых роботов (Google, Яндекс),
 * чтобы отдать им уникальные, кликабельные теги <title> и <meta> для каждой вакансии.
 */
export async function generateMetadata({ params }: Props) {
    // В свежих версиях Next.js объект params является Promise, резолвим его через await
    const resolvedParams = await params;
    const pathSegments = resolvedParams.id || [];

    const cardId = pathSegments[0];   // Первый сегмент пути, например: "vacancy" или "travel"
    const vacancyId = pathSegments[1]; // Второй сегмент (динамический ID из базы данных), например: "123"

    // Кейс: Поисковый робот зашел по прямой ссылке на конкретную вакансию (/card/vacancy/123)
    if (cardId === 'vacancy' && vacancyId) {
        try {
            // Делаем точечный запрос в БД, чтобы вытащить название должности и организации
            // Приводим vacancyId к числу через Number(), если ID в базе данных целочисленный (INT)
            const { rows } = await pool.query<Vacancy>(
                "SELECT title AS profession, company_name AS organization FROM vacancies WHERE id = $1 AND is_active = TRUE",
                [Number(vacancyId)]
            );
            const vacancy = rows[0];

            if (vacancy) {
                // Возвращаем уникальные SEO-теги. Робот Яндекса покажет это как красивый сниппет в выдаче
                return {
                    title: `${vacancy.profession} в ${vacancy.organization} | Актуальные вакансии`,
                    description: `Ознакомьтесь с условиями работы, требованиями и обязанностями для позиции: ${vacancy.profession}. Откликнуться прямо сейчас.`
                };
            }
        } catch (error) {
            // В случае сбоя БД логируем ошибку, но не валим генерацию метаданных для страницы
            console.error('[SEO_METADATA_ERROR]:', error);
        }
    }

    // Дефолтный маппинг статических заголовков для основных разделов приложения
    const titles: Record<string, string> = {
        'travel': '5 Inspiring Apps for Your Next Trip',
        'coding': 'Как верстают архитекторы интерфейсов',
        'vacancy': 'Доступные вакансии'
    };

    const pageTitle = titles[cardId || ''] || 'Карточка';
    return { title: `${pageTitle} | App Store` };
}

// ==========================================================================
// 2. СЕРВЕРНЫЙ КОНТРОЛЛЕР СОСТОЯНИЯ (Server State Hydrator)
// ==========================================================================
/**
 * Основной серверный компонент страницы. Выполняется строго на бэкенде.
 * Он НЕ генерирует отдельную статическую верстку, а рендерит ВСЮ оболочку приложения (Main),
 * предварительно прочитав глубокие URL-пути из адресной строки и пробросив их в виде стартовых стейтов.
 *
 * Паттерн: Isomorphic Shell Rehydration (Изоморфное восстановление оболочки).
 */
export default function CardCatchAllPage({ params }: Props) {
    // Синхронно резолвим параметры роута внутри тела компонента через стандартный хук React `use()`
    const resolvedParams = use(params);
    const pathSegments = resolvedParams.id || [];

    const cardId = pathSegments[0] || null;    // Базовый ID карточки ("vacancy", "travel")
    const vacancyId = pathSegments[1] || null; // Динамический ID вакансии (если зашли глубоко), иначе null

    // Валидация роутов: защищает приложение от ручного ввода хакерами или юзерами несуществующих путей в браузере
    const validIds = ['vacancy', 'travel', 'coding', 'A', 'B'];
    if (cardId && !validIds.includes(cardId)) {
        notFound();
    }

    // 🌟 СЕНЬОР-МУВ: Мы изолируем системные типы страниц Next.js от бизнес-логики.
    // Вызываем главный компонент Main, передавая туда прочитанные сервером ID.
    // При первом же кадре рендеринга на клиенте React мгновенно восстановит точную копию окон,
    // которая была открыта у пользователя до нажатия клавиши F5.
    return (
        <Main
            initialActiveId={cardId}
            initialVacancyId={vacancyId}
        />
    );
}
