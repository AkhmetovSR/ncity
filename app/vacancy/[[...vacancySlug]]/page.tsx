// app/vacancy/[[...vacancySlug]]/page.tsx

import React from "react";
import VacancyList from "@/app/vacancy/_components/VacancyList";
import s from "@/app/vacancy/[[...vacancySlug]]/vacancy.module.css";

interface VacancyCatchAllProps {
    // В Next.js params — это Promise, разворачиваем его
    params: Promise<{ vacancySlug?: string[] }>;
}

/**
 * Серверный компонент-контроллер раздела вакансий.
 * Отвечает за SEO и первоначальный рендеринг шторки при прямом заходе.
 */
export default async function VacancyCatchAllPage({ params }: VacancyCatchAllProps) {
    const {vacancySlug} = await params;

    // Определяем, открыта ли карточка вакансии при ПРЯМОМ заходе
    // URL: /vacancy/card/123 -> vacancySlug будет ['card', '123']
    const initialModalOpen = vacancySlug?.[0] === 'card';
    const initialVacancyId = initialModalOpen ? vacancySlug?.[1] || '' : '';

    return (
        <div className={s.VacancyPage}>
            {/* Передаем клиентскому списку начальное состояние из URL */}
            <VacancyList initialVacancyId={initialVacancyId}/>
        </div>
    );
}