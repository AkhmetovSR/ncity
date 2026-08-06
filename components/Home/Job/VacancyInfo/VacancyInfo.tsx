'use client';

import React from "react";
import BottomSheet from "@/components/UI/BottomSheet/BottomSheet";
import VacancyHeader from "@/components/Home/Job/VacancyInfo/VacancyHeader/VacancyHeader";
import VacancyContent from "@/components/Home/Job/VacancyInfo/VacancyContent/VacancyContent";
import { Vacancy } from "@/types/vacancy";

interface VacancyInfoProps {
    vacancy: Vacancy | null;
    onClose: () => void;
}

/**
 * Идеально чистая бизнес-обертка над кастомным движком шторки
 */
export default function VacancyInfo({ vacancy, onClose }: VacancyInfoProps) {
    if (!vacancy) return null;

    return (
        <BottomSheet isOpen={Boolean(vacancy)} onClose={onClose}>
            {/* Больше никаких пропсов для отслеживания скролла! Движок делает всё сам под капотом */}
            <VacancyHeader vacancy={vacancy} onClose={onClose} />
            <VacancyContent vacancy={vacancy} onClose={onClose} />
        </BottomSheet>
    );
}
