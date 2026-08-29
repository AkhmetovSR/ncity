// app/vacancy/layout.tsx
import React from "react";
import { VacancyProvider } from "@/app/vacancy/_context/VacancyContext"; // Путь к контексту, если перенесли его сюда

interface VacancyLayoutProps {
    children: React.ReactNode;
}

/**
 * Макет раздела вакансий.
 * Обертывает все подстраницы раздела в VacancyProvider.
 * Благодаря этому кэш вакансий не сбрасывается при навигации.
 */
export default function VacancyLayout({ children }: VacancyLayoutProps) {
    return (
        <VacancyProvider>
            {children}
        </VacancyProvider>
    );
}
