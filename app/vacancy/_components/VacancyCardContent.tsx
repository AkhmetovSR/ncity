// components/Home/Job/VacancyList/VacancyCardContent.tsx
'use client';

import React from "react";

interface VacancyCardContentProps {
    id: string;
}

/**
 * Обычный div с контентом, который рендерится внутри шторки-оболочки
 */
export default function VacancyCardContent({ id }: VacancyCardContentProps) {
    return (
        <div style={{ color: '#000' }}>
            <h2>Описание вакансии #{id}</h2>
            <p style={{ marginTop: '16px', color: '#666', lineHeight: 1.5 }}>
                Этот div полностью изолирован. Твоя концепция slug перенесена на 100%.
                Сюда ты можешь выводить любые данные или делать fetch по ID.
            </p>
        </div>
    );
}
