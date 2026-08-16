// components/Home/Job/VacancyInfo/VacancyInfo.tsx
'use client';

import React from "react";
import BottomSheet from "@/components/UI/BottomSheet/BottomSheet";
import VacancyHeader from "@/components/Home/Job/VacancyInfo/VacancyHeader/VacancyHeader";
import VacancyContent from "@/components/Home/Job/VacancyInfo/VacancyContent/VacancyContent";
import { Vacancy } from "@/types/vacancy";

interface VacancyInfoProps {
    // Используем строгий типизированный интерфейс вместо any, допускаем null для безопасности
    vacancy: Vacancy | null;

    // 🌟 СЕНЬОР-ФИКС ТИПИЗАЦИИ: Явно указываем, что шторка принимает кнопку-крестик закрытия
    children: React.ReactNode;
}

/**
 * Идеологически чистая бизнес-обертка над кастомным движком шторки.
 * Полностью декларативный компонент мирового уровня. Не хранит локальных стейтов закрытия.
 */
export default function VacancyInfo({ vacancy, children }: VacancyInfoProps) {
    // Ранний возврат (Guard Clause) — если вакансия пуста, в DOM ничего не рендерится
    if (!vacancy) return null;

    return (
        /*
           🌟 СЕНЬОР-ФИКС: Передаем весь контент шторки как чистый children внутрь BottomSheet.
           Из вызова удалена лишняя шелуха в виде невалидных пропсов vacancy={Boolean(vacancy)} и onClose.
        */
        <BottomSheet>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>

                {/*
                   🌟 СЕНЬОР-ФИКС КРЕСТИКА: Рендерим переданную кнопку закрытия (handleNavigationBack)
                   прямо на верхнем слое шторки. Клик по ней нативно сделает шаг назад в истории.
                */}
                <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 100 }}>
                    {children}
                </div>

                {/* Шапка вакансии (Логотип, Компания, Название профессии) */}
                <VacancyHeader vacancy={vacancy} />

                {/* Основной скролл-контент (Обязанности, Требования, Условия) */}
                <VacancyContent vacancy={vacancy} />

            </div>
        </BottomSheet>
    );
}
