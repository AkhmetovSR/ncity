'use client';
import { useState } from 'react';
import styles from './ParserButton.module.css';

interface Vacancy {
    page: number;
    profession: string;
    salary: string;
    district: string;
    organization: string;
    date: string;
    schedule: string;
}

export default function ParserButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [parsingResult, setParsingResult] = useState<{ success: boolean; message: string; jobsCount?: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const runParser = async () => {
        setIsLoading(true);
        setError(null);
        setParsingResult(null);
        setVacancies([]);

        try {
            // Запускаем парсер
            const response = await fetch('/api/parse?mode=online', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (data.success) {
                setParsingResult({
                    success: true,
                    message: 'Парсинг успешно завершен!',
                    jobsCount: data.jobsCount
                });

                // Загружаем спарсенные вакансии
                await loadVacancies();
            } else {
                setParsingResult({
                    success: false,
                    message: data.error || 'Ошибка при парсинге'
                });
            }

            setShowModal(true);
        } catch (err: any) {
            setError(err.message || 'Ошибка соединения с сервером');
            setShowModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    const loadVacancies = async () => {
        try {
            const response = await fetch('/api/vacancies');
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                setVacancies(data);
            }
        } catch (err) {
            console.error('Ошибка загрузки вакансий:', err);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setTimeout(() => {
            setParsingResult(null);
            setError(null);
        }, 300);
    };

    return (
        <>
            <button
                className={styles.parserButton}
                onClick={runParser}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <span className={styles.spinner}></span>
                        Парсинг...
                    </>
                ) : (
                    '🔄 Обновить вакансии'
                )}
            </button>

            {/* Модальное окно */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>📊 Результат парсинга</h3>
                            <button className={styles.closeButton} onClick={closeModal}>×</button>
                        </div>

                        <div className={styles.modalBody}>
                            {error && (
                                <div className={styles.error}>
                                    ❌ {error}
                                </div>
                            )}

                            {parsingResult && (
                                <div className={parsingResult.success ? styles.success : styles.error}>
                                    {parsingResult.success ? '✅ ' : '❌ '}
                                    {parsingResult.message}
                                    {parsingResult.jobsCount !== undefined && (
                                        <p>📊 Найдено вакансий: <strong>{parsingResult.jobsCount}</strong></p>
                                    )}
                                </div>
                            )}

                            {/* Список вакансий */}
                            {vacancies.length > 0 && (
                                <div className={styles.vacanciesSection}>
                                    <h4>📋 Спарсенные вакансии ({vacancies.length})</h4>
                                    <div className={styles.vacanciesList}>
                                        {vacancies.map((vacancy, idx) => (
                                            <div key={idx} className={styles.vacancyCard}>
                                                <div className={styles.vacancyHeader}>
                                                    <span className={styles.vacancyNumber}>#{idx + 1}</span>
                                                    <span className={styles.vacancyProfession}>{vacancy.profession}</span>
                                                </div>
                                                <div className={styles.vacancyDetails}>
                                                    {vacancy.salary && (
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailIcon}>💰</span>
                                                            <span>{vacancy.salary}</span>
                                                        </div>
                                                    )}
                                                    {vacancy.district && (
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailIcon}>📍</span>
                                                            <span>{vacancy.district}</span>
                                                        </div>
                                                    )}
                                                    {vacancy.organization && (
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailIcon}>🏢</span>
                                                            <span>{vacancy.organization}</span>
                                                        </div>
                                                    )}
                                                    {vacancy.date && (
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailIcon}>📅</span>
                                                            <span>{vacancy.date}</span>
                                                        </div>
                                                    )}
                                                    {vacancy.schedule && (
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailIcon}>⏰</span>
                                                            <span>{vacancy.schedule}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!error && !parsingResult && !vacancies.length && (
                                <div className={styles.info}>
                                    ⏳ Запускаем парсер...
                                </div>
                            )}
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.closeModalButton} onClick={closeModal}>
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}