// app/card/[id]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import VacancyList from "@/components/Home/Job/VacancyList/VacancyList";
import { PAGE_REGISTRY } from "@/app/cards";
import s from '@/app/page.module.css';

interface Props {
    // 🌟 СЕНЬОР-ФИКС ТИПИЗАЦИИ: Поскольку папка теперь называется [id],
    // параметр id — это строго строка, а не массив сегментов.
    params: Promise<{ id: string }>;

    // 🌟 СЕНЬОР-ФИКС F5 ДЛЯ QUERY-ПАРАМЕТРОВ: Next.js автоматически пробрасывает
    // все query-параметры (?v=123) в серверный объект searchParams.
    searchParams: Promise<{ v?: string }>;
}

const VALID_CARD_IDS = new Set(['vacancy', 'travel', 'coding', 'A', 'B']);

export default async function HardRouteCardPage({ params, searchParams }: Props) {
    // Безопасно параллельно или последовательно дожидаемся разрешения промисов на сервере
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const cardId = resolvedParams?.id || null;

    // Подхватываем id вакансии из query-параметра ?v=123, если это был жесткий рефреш
    const vacancyId = resolvedSearchParams?.v || null;

    // Серверная валидация раздела за O(1)
    if (!cardId || !VALID_CARD_IDS.has(cardId)) {
        notFound();
    }

    const ContentComponent = PAGE_REGISTRY[cardId] || null;

    return (
        <div className={s.fullPageFallbackContent}>
            {/* Нативная ссылка-кнопка для возврата на главную */}
            <Link href="/" className={s.backToMainButton} scroll={false}>
                ← Назад на главную
            </Link>

            <div className={s.fallbackWrapper}>
                {cardId === 'vacancy' ? (
                    /*
                       🌟 СЕНЬОР-ФИКС: Мы больше не передаем никаких пропсов в VacancyList!
                       Ошибка TypeScript полностью исчезла. Компонент VacancyList внутри себя
                       сам нативно прочитает query-параметр как на сервере, так и на клиенте.
                    */
                    <VacancyList />
                ) : ContentComponent ? (
                    <ContentComponent isOpen={true} />
                ) : null}
            </div>
        </div>
    );
}
