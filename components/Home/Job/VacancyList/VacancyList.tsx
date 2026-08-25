// components/Home/Job/VacancyList/VacancyList.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import VacancyGrid from "./VacancyGrid";
import VacancySheet from "./VacancySheet"; // Наша контролируемая шторка
import VacancyCardContent from "./VacancyCardContent"; // Просто div с контентом описания
import { useVacancies } from "@/hooks/useVacancies";
import s from '@/components/Home/Job/VacancyList/VacancyList.module.css';

// 🌟 СЕНЬОР-ФИКС: Обязательно добавляем export перед интерфейсом!
export interface VacancyListProps {
    initialVacancyId: string;
}

export default function VacancyList({ initialVacancyId }: VacancyListProps) {
    const { vacancies, loading, error, handleRetry } = useVacancies();
    const [activeVacancyId, setActiveVacancyId] = useState<string>(initialVacancyId);

    useEffect(() => {
        // Если при первом заходе шторка уже открыта сервером, помечаем точку в истории
        if (initialVacancyId) {
            window.history.replaceState({ type: 'direct-vacancy-modal' }, '');
        }

        // Слушаем ручной клик из сетки вакансий
        const handleOpenSheet = (e: Event) => {
            const customEvent = e as CustomEvent<string>;
            setActiveVacancyId(customEvent.detail);
        };

        // Слушаем системную кнопку «Назад» в браузере (копия твоей логики синхронизации)
        const handlePopState = () => {
            const pathname = window.location.pathname;
            const isBaseVacancyRoute = pathname === '/vacancy' || pathname === '/vacancy/';

            if (isBaseVacancyRoute) {
                setActiveVacancyId(''); // Плавно закрываем шторку
            } else {
                const pathParts = pathname.split('/');
                const vacancyId = pathParts[pathParts.length - 1];
                if (vacancyId) setActiveVacancyId(vacancyId);
            }
        };

        window.addEventListener('open-vacancy-sheet', handleOpenSheet);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('open-vacancy-sheet', handleOpenSheet);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [initialVacancyId]);

    return (
        <motion.div className={s.contentWrapper}>
            <div className={s.vacancyList}>
                <AnimatePresence mode="wait">
                    {loading && <VacancyGrid vacancies={[]} loading={true} />}

                    {!loading && !error && vacancies.length > 0 && (
                        <VacancyGrid vacancies={vacancies} />
                    )}
                    {/* Твоя обработка ошибок и пустого стейта */}
                </AnimatePresence>
            </div>

            {/* 🌟 ШТОРКА: Работает как твой ModalAnimateWrapper + ModalClientContainer 🌟 */}
            <AnimatePresence>
                {activeVacancyId && (
                    <VacancySheet
                        key={activeVacancyId}
                        id={activeVacancyId}
                        onClose={() => setActiveVacancyId('')}
                    >
                        {/* Внутрь шторки-контейнера просто прокидываем div с контентом */}
                        <VacancyCardContent id={activeVacancyId} />
                    </VacancySheet>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
