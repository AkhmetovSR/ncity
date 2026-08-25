// components/Home/Job/VacancyList/VacancyList.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import VacancyGrid from "./VacancyGrid";
import VacancySheet from "./VacancySheet";
import VacancyCardContent from "./VacancyCardContent";
import { useVacancies } from "@/hooks/useVacancies";
import s from '@/components/Home/Job/VacancyList/VacancyList.module.css';

interface VacancyListProps {
    initialVacancyId: string;
}

export default function VacancyList({ initialVacancyId }: VacancyListProps) {
    const { vacancies, loading, error, handleRetry } = useVacancies();
    const [activeVacancyId, setActiveVacancyId] = useState<string>(initialVacancyId);

    // 🌟 СИНХРОНИЗАЦИЯ С ИСТОРИЕЙ (ПОЛНАЯ СИММЕТРИЯ ТВОЕЙ ГЛАВНОЙ)
    useEffect(() => {
        if (initialVacancyId) {
            window.history.replaceState({ type: 'direct-vacancy-modal' }, '');
        }

        const handlePopState = () => {
            const pathname = window.location.pathname;
            // Если вернулись на корень раздела вакансий
            const isBaseVacancyRoute = pathname === '/vacancy' || pathname === '/vacancy/';

            if (isBaseVacancyRoute) {
                setActiveVacancyId(''); // Закрываем шторку
            } else {
                // Если перемещаемся по истории вперед-назад между вакансиями
                const pathParts = pathname.split('/');
                const vacancyId = pathParts[pathParts.length - 1];
                if (vacancyId) setActiveVacancyId(vacancyId);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [initialVacancyId]);

    return (
        <motion.div className={s.contentWrapper}>
            <div className={s.vacancyList}>
                <AnimatePresence mode="wait">
                    {loading && (
                        // Прокидываем пустую функцию в скелетоны, чтобы типы не ругались
                        <VacancyGrid vacancies={[]} loading={true} onVacancyClick={() => {}} />
                    )}

                    {!loading && !error && vacancies.length > 0 && (
                        // 🌟 ВОТ ОНА АНАЛОГИЯ: передаем функцию изменения стейта прямо в грид
                        <VacancyGrid
                            vacancies={vacancies}
                            onVacancyClick={(id) => setActiveVacancyId(id)}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Шторка анимируется через AnimatePresence на основе стейта activeVacancyId */}
            <AnimatePresence>
                {activeVacancyId && (
                    <VacancySheet
                        key={activeVacancyId}
                        id={activeVacancyId}
                        onClose={() => setActiveVacancyId('')}
                    >
                        <VacancyCardContent id={activeVacancyId} />
                    </VacancySheet>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
