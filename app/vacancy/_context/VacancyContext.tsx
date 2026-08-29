// app/vacancy/_context/VacancyContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Vacancy } from '@/types/vacancy';

// Описываем, какие данные и функции контекст будет отдавать наружу
interface VacancyContextType {
    vacancies: Vacancy[];
    setVacancies: React.Dispatch<React.SetStateAction<Vacancy[]>>;
    hasLoadedOnce: boolean; // Флаг: были ли вакансии загружены хоть раз
    setHasLoadedOnce: (value: boolean) => void;
}

// Создаем сам контекст с дефолтными значениями
const VacancyContext = createContext<VacancyContextType | undefined>(undefined);

// Компонент-обертка, который сохранит стейт в памяти приложения
export function VacancyProvider({ children }: { children: ReactNode }) {
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(false);

    return (
        <VacancyContext.Provider value={{ vacancies, setVacancies, hasLoadedOnce, setHasLoadedOnce }}>
            {children}
        </VacancyContext.Provider>
    );
}

// Кастомный хук для быстрого и безопасного доступа к контексту
export function useVacancyContext() {
    const context = useContext(VacancyContext);
    if (!context) {
        throw new Error('useVacancyContext должен использоваться внутри VacancyProvider');
    }
    return context;
}
