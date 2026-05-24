'use client';
import s from '@/components/Home/Job/VacancyInfo/VacancyHeader/VacancyHeader.module.css';
import { motion } from "framer-motion";
import { useRef } from "react";
import { Vacancy } from "@/types/vacancy";
interface VacancyInfoProps {
    vacancy?: Vacancy;
    onClose?: () => void;
}

export default function VacancyHeader({ vacancy, onClose }: VacancyInfoProps) {
    return (
        <div className={s.header}>
            <div className={s.headerContent}>
                <div className={s.divTitle}>
                    <h2 className={s.title}>{vacancy.profession}</h2>
                    <button className={s.closeButton} onClick={onClose}>✕</button>
                </div>
                {vacancy.salary && (
                    <motion.div className={s.salaryBox}>
                        <span className={s.salaryIcon}>🪙 </span>
                        <span className={s.salaryValue}>{vacancy.salary} ₽</span>
                    </motion.div>
                )}
            </div>
        </div>
    )
}