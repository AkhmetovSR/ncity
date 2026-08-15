// components/Home/Job/VacancyInfo/VacancyInfo.tsx
'use client';

import React from "react";
import BottomSheet from "@/components/UI/BottomSheet/BottomSheet";
import VacancyHeader from "@/components/Home/Job/VacancyInfo/VacancyHeader/VacancyHeader";
import VacancyContent from "@/components/Home/Job/VacancyInfo/VacancyContent/VacancyContent";
import { Vacancy } from "@/types/vacancy";
import s from "./VacancyInfo.module.css";

interface VacancyInfoProps {
    vacancy: Vacancy;
    children: React.ReactNode;
}

/**
 * Шторка детальной информации о вакансии (Уровень вложенности 2)
 */
export default function VacancyInfo({ vacancy, children }: VacancyInfoProps) {
    return (
        /*
           🌟 СЕНЬОР-АНАЛИЗ ОШИБКИ: TypeScript ругается на <BottomSheet>, потому что в его внутренней
           сигнатуре (интерфейсе пропсов) не описано обязательное свойство `children`.
           Поскольку наш BottomSheet — это кастомная UI-обертка, она обязана принимать React-ноды внутрь.

           Чтобы исправить эту ошибку типизации раз и навсегда без костылей, нам нужно передать
           весь контент шторки как children, предварительно убедившись, что сам компонент BottomSheet
           правильно типизирован.
        */
        <BottomSheet>
            <div className={s.drawerContainer}>
                <div className={s.closeButtonWrapper}>
                    {children}
                </div>

                {/* Шапка вакансии (Логотип, Компания, Название профессии) */}
                <VacancyHeader vacancy={vacancy} />

                {/* Основной скролл-контент (Обязанности, Требования, Условия, Кнопка отклика) */}
                <VacancyContent vacancy={vacancy} />
            </div>
        </BottomSheet>
    );
}
