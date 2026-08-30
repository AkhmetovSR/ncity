// app/vacancy/_context/VacancyContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Vacancy } from '@/types/vacancy';

interface VacancyContextType {
    vacancies: Vacancy[];
    setVacancies: React.Dispatch<React.SetStateAction<Vacancy[]>>;
    hasLoadedOnce: boolean;
    setHasLoadedOnce: (value: boolean) => void;
}

const VacancyContext = createContext<VacancyContextType | undefined>(undefined);

export function VacancyProvider({ children }: { children: ReactNode }) {
    // 🌟 СЕНЬОР-ФИКС: Синхронно читаем сохраненный кэш из localStorage в первый же миг создания компонента.
    // Это предотвращает появление пустых массивов на долю секунды.
    const [vacancies, setVacancies] = useState<Vacancy[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('local_jobs_top50');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    // 🌟 СЕНЬОР-ФИКС: Если в localStorage уже есть сохраненные вакансии, флаг сразу равен true.
    // Из-за этого хук useVacancies мгновенно выставит loading = false, и красные скелетоны не отрендерятся.
    const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('local_jobs_top50') !== null;
        }
        return false;
    });

    // Фоновый запрос топа вакансий из БД при запуске сайта/PWA
    useEffect(() => {
        const controller = new AbortController();

        async function prefetchVacancies() {
            try {
                // Запрашиваем первые 50 вакансий
                const res = await fetch('/vacancy/api?limit=50&offset=0', { signal: controller.signal });
                if (!res.ok) return;

                const data: Vacancy[] = await res.json();

                setVacancies(data);
                setHasLoadedOnce(true);

                // Обновляем localStorage актуальными данными из базы для следующего холодного старта
                localStorage.setItem('local_jobs_top50', JSON.stringify(data));
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') return;
                console.error('Ошибка предзагрузки вакансий:', err);
            }
        }

        void prefetchVacancies();
        return () => controller.abort();
    }, []); // Срабатывает строго 1 раз при инициализации всего приложения

    return (
        <VacancyContext.Provider value={{ vacancies, setVacancies, hasLoadedOnce, setHasLoadedOnce }}>
            {children}
        </VacancyContext.Provider>
    );
}

export function useVacancyContext() {
    const context = useContext(VacancyContext);
    if (!context) {
        throw new Error('useVacancyContext должен использоваться внутри VacancyProvider');
    }
    return context;
}
