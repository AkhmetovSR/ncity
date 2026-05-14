'use client';
import styles from './VacancyList.module.css';
import vacancyData from "@/data/trudvsem_20260512_1778609414070.json";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';

export default function VacancyList() {

    if (vacancyData.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <div className={styles.empty}>
                    <p>Нет вакансий.</p>
                    <button className={styles.loadButton}>
                        📥 Загрузить вакансии
                    </button>
                    <p className={styles.hint}>Или нажмите "Парсить вакансии" сначала.</p>
                </div>
            </div>
        );
    }

    return (
        // <AnimatePresence>
            <motion.div className={styles.fullscreenOverlay} layoutId="vacancy" transition={{ duration: 0.3, ease: "easeOut", type: "tween", delay: 0 }}>
                <motion.div className={styles.fullscreenContent} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.contentWrapper}>
                        <div className={styles.header}>
                            <h2>Список вакансий</h2>
                            <Link href="/" className={styles.closeButton}>
                                ✕
                            </Link>
                        </div>

                        <div className={styles.vacancyList}>
                            {vacancyData.map((vacancy: any) => (
                                <div key={vacancy.id} className={styles.vacancyCard}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.profession}>{vacancy.profession}</h3>
                                        <div className={styles.salary}>{vacancy.salary}</div>
                                    </div>

                                    <div className={styles.details}>
                                        <span className={styles.organization}>🏢 {vacancy.organization}</span>
                                        <span className={styles.district}>📍 {vacancy.district}</span>
                                        <span className={styles.date}>📅 {vacancy.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        // </AnimatePresence>
    );
}