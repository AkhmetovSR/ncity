// app/card/[[...id]]/page.tsx
import React, { use } from 'react';
import { notFound } from 'next/navigation'; // Каноническая функция Next.js для вызова 404 ошибки
import Main from "@/components/Main/Main"; // Наше интерактивное клиентское SPA-ядро интерфейса

// Описываем форму динамических параметров, которые Next.js поставляет в серверный роут
interface Props {
    params: Promise<{ id?: string[] }>; // В Next.js params по канону является Промисом
}

// Список строго разрешенных ID карточек, которые физически существуют в нашем приложении
const VALID_CARD_IDS = new Set(['vacancy', 'travel', 'coding', 'A', 'B']);

/**
 * 1. 🌟 КАНОНИЧЕСКАЯ ГЕНЕРАЦИЯ МЕТАТЕГОВ (SEO):
 * Next.js автоматически вызывает эту функцию на сервере до рендеринга страницы.
 * Поисковые роботы Яндекса и Google получат красивый заголовок и описание карточки.
 */
export async function generateMetadata({ params }: Props) {
    const resolvedParams = await params; // Разворачиваем асинхронный объект параметров
    const pathSegments = resolvedParams.id || [];

    const cardId = pathSegments[0] || 'vacancy'; // Первый сегмент — ID шторки
    const vacancyId = pathSegments[1] || null;    // Второй сегмент — ID конкретной вакансии

    // Простой словарь для формирования SEO-тайтлов на сервере
    const titles: Record<string, string> = {
        'vacancy': 'Работа и свежие вакансии в Нягани',
        'travel': 'Путешествия по Ханты-Мансийскому округу',
        'coding': 'Блог: Как верстают архитекторы интерфейсов'
    };

    // Если открыта конкретная вакансия в шторке, делаем глубокий тайтл
    const baseTitle = titles[cardId] || 'Информационная карточка';
    const pageTitle = vacancyId ? `Вакансия №${vacancyId} | ${baseTitle}` : baseTitle;

    return {
        title: `${pageTitle} — Городской Портал`,
        description: `Актуальная информация, детальные условия и требования в разделе ${cardId} на официальном портале города Нягань.`,
    };
}

/**
 * 2. 🌟 ГЛАВНЫЙ СЕРВЕРНЫЙ КОМПОНЕНТ РОУТА (SSR Fallback):
 */
export default function CardCatchAllPage({ params }: Props) {
    // 🌟 Разворачиваем Промис параметров с помощью нативной React-функции "use"
    const resolvedParams = use(params);
    const pathSegments = resolvedParams.id || [];

    // Раскладываем сегменты пути в переменные для валидации
    const cardId = pathSegments[0] || null;
    const vacancyId = pathSegments[1] || null;

    // 🌟 СЕНЬОР-ЗАЩИТА (Безопасность):
    // Если пользователь вручную вбил в адресную строку несуществующий ID (например, /card/hello-world),
    // мы не имеем права инициализировать SPA-ядро. Мы декларативно прерываем выполнение
    // и отдаем каноническую страницу 404 (NotFound), чтобы поисковики не индексировали мусорные ссылки [INDEX].
    if (cardId && !VALID_CARD_IDS.has(cardId)) {
        notFound();
    }

    return (
        /*
           🌟 ИНИЦИАЛИЗАЦИЯ И ГИДРАТАЦИЯ SPA:
           Мы пробрасываем считанные сервером ID прямо в пропсы компонента Main [INDEX].
           Когда страница загрузится в браузере, клиентский React сразу увидит эти initial-значения,
           хук useAppHistory подхватит их, и нужная модалка (StoreCard) откроется в первый же кадр
           загрузки сайта, обеспечивая бесшовное поведение без моргания экрана [INDEX].
        */
        <Main
            initialActiveId={cardId}
            initialVacancyId={vacancyId}
        />
    );
}
