'use client';

import s from "@/components/vidgets.module.css"
import StoreCard from '@/components/StoreCard';
import Job from "@/components/Home/Job/Job"; // Твоя маленькая карточка с Lottie
import VacancyList from "@/components/Home/Job/VacancyList/VacancyList"; // Твой список вакансий

interface SpecialPromoCardProps {
    activeId: string | null;
    setActiveId: (id: string | null) => void;
}

export function SpecialPromoCard({ activeId, setActiveId }: SpecialPromoCardProps) {
    const id = "vacancy"; // Уникальный ID для этой промо-карточки
    const isOpen = activeId === id;

    return (
        <div className={s.VacancyCard}>
            <StoreCard
                id={id}
                // gradient="linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)" // Фон, который плавно расширится
                activeId={activeId}
                setActiveId={setActiveId}
            >
                {/*
                  Управляем показом контента:
                  Если модалка открыта — рендерим список вакансий,
                  Если закрыта — рендерим маленькую карточку с Lottie
                */}
                {isOpen ? <VacancyList /> : <Job />}
            </StoreCard>
        </div>
    );
}
