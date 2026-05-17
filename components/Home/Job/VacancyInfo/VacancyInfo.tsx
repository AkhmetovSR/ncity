'use client';
import s from './VacancyInfo.module.css';
import {motion, AnimatePresence} from "framer-motion";
import Link from 'next/link';
import {useEffect, useState} from "react";

interface VacancyInfoProps {
    vacancy?: any;
    onClose?: () => void;
}

export default function VacancyInfo({vacancy}: VacancyInfoProps) {
    return (
        <motion.div className={s.VacancyInfo} initial={{y: 500, opacity: 0}} animate={{y: 0, opacity: 1}}
                    transition={{duration: 0.3}}>
            {vacancy.id}
        </motion.div>
    );
}