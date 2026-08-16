// components/Home/Job/VacancyInfo/VacancyInfo.tsx
'use client';

import React from "react";
import BottomSheet from "@/components/UI/BottomSheet/BottomSheet";
import VacancyHeader from "@/components/Home/Job/VacancyInfo/VacancyHeader/VacancyHeader";
import VacancyContent from "@/components/Home/Job/VacancyInfo/VacancyContent/VacancyContent";
import { Vacancy } from "@/types/vacancy";

interface VacancyInfoProps {
    vacancy: Vacancy | null;
    children: React.ReactNode; // Принимаем нативную кнопку-крестик из файла-контроллера
}

/**
 * Идеально чистая бизнес-обертка над кастомным движком шторки
 */
export default function VacancyInfo({ vacancy, children }: VacancyInfoProps) {
    if (!vacancy) return null;

    return (
        /*
           🌟 СЕНЬОР-ФИКС: Контент передается как чистый children.
           BottomSheet автономен, он заблокирует body.style.overflow на клиенте.
        */
        <BottomSheet>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>

                {/* Рендерим нативную кнопку закрытия (router.back()) на верхнем слое шторки */}
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
