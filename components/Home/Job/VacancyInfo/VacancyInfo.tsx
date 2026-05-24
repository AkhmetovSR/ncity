'use client';
import s from './VacancyInfo.module.css';
import { motion } from "framer-motion";
import { useRef } from "react";
import { Vacancy } from "@/types/vacancy";
import VacancyHeader from "@/components/Home/Job/VacancyInfo/VacancyHeader/VacancyHeader";
import VacancyContent from "@/components/Home/Job/VacancyInfo/VacancyContent/VacancyContent";
interface VacancyInfoProps {
    vacancy?: Vacancy;
    onClose?: () => void;
}

export default function VacancyInfo({ vacancy, onClose }: VacancyInfoProps) {

    if (!vacancy) return null;

    return (
        <>
            {/* Затемнённый фон */}
            <motion.div
                className={s.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                transition={{ duration: 0.2 }}
            />
            <motion.div
                className={s.vacancyInfo}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
                <VacancyHeader vacancy={vacancy} onClose={onClose}/>
                <VacancyContent vacancy={vacancy} onClose={onClose}/>
            </motion.div>
        </>
    );
}