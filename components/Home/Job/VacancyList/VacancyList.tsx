'use client';
import styles from './VacancyList.module.css';
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { useEffect, useState } from "react";

export default function VacancyList() {
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Загружаем актуальные вакансии через API
        fetch('/api/vacancies')
            .then(res => res.json())
            .then(data => {
                setVacancies(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <motion.div className={styles.fullscreenOverlay} layoutId="vacancy">
                <div className={styles.fullscreenContent}>
                    <div className={styles.loading}>Загрузка...</div>
                </div>
            </motion.div>
        );
    }

    if (vacancies.length === 0) {
        return (
            <motion.div className={styles.fullscreenOverlay} layoutId="vacancy">
                <div className={styles.fullscreenContent}>
                    <div className={styles.emptyContainer}>
                        <div className={styles.empty}>
                            <p>Нет вакансий.</p>
                            <p className={styles.hint}>Парсинг выполняется автоматически каждый день в 23:00</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div className={styles.fullscreenOverlay} layoutId="vacancy" transition={{ duration: 0.3, ease: "easeOut", type: "tween" }}>
            <motion.div className={styles.fullscreenContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.contentWrapper}>
                    <div className={styles.header}>
                        <h2>Список вакансий</h2>
                        <Link href="/" className={styles.closeButton}>✕</Link>
                    </div>

                    <div className={styles.vacancyList}>
                        {vacancies.map((vacancy: any, index: number) => (
                            <div key={index} className={styles.vacancyCard}>
                                <div className={styles.cardHeader}>
                                    <h3 className={styles.profession}>{vacancy.profession}</h3>
                                    <div className={styles.salary}>{vacancy.salary}</div>
                                </div>

                                <div className={styles.details}>

                                    <span className={styles.date}>📅 {vacancy.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}



{/*<span className={styles.organization}>🏢 {vacancy.organization}</span>*/}
{/*<span className={styles.district}>📍 {vacancy.district}</span>*/}