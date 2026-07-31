'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import StoreCard from '@/components/StoreCard';
import Job from "@/components/Home/Job/Job";
// import VacancyList from "@/components/Home/Job/VacancyList/VacancyList";
import s from '@/app/page.module.css';

interface SpecialPromoCardProps {
    activeId: string | null;
    setActiveId: (id: string | null) => void;
}

export function SpecialPromoCard({ activeId, setActiveId }: SpecialPromoCardProps) {
    const id = "vacancy";
    const isOpen = activeId === id;
    // const gradient = "linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)";

    return (
        <div className={s.VacancyCard}>
            {/* 1. Свернутый вид: Обычная широкая карточка (БЕЗ класса gridCard!) */}
            <Link
                href={`/card/${id}`}
                className={s.cardLink}
                onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.button === 1) return;
                    e.preventDefault();
                    setActiveId(id);
                }}
            >
                <motion.div
                    layoutId={`card-bg-${id}`}
                    className={s.cardBase} // Только базовые стили (скругление, курсор)
                    // style={{ background: gradient, padding: '1.5rem', height: '140px' }} // Твои кастомные размеры для Job
                    whileTap={{ scale: 0.98 }}
                >
                    {!isOpen && <Job />}
                </motion.div>
            </Link>

            {/* 2. Модалка для списка вакансий */}
            <StoreCard id={id}
                       // gradient={gradient}
                       activeId={activeId}
                       setActiveId={setActiveId}>
                {/*<VacancyList />*/}
            </StoreCard>
        </div>
    );
}
