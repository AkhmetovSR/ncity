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
    const [result, setResult] = useState<{ success: boolean; message: string; jobsCount?: number; vacancies?: Vacancy[] } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const runParser = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/parse?mode=online', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (data.success) {
                setResult({
                    success: true,
                    message: 'Парсинг успешно завершен!',
                    jobsCount: data.jobsCount
                });

                // После успешного парсинга загружаем вакансии
                await loadVacancies();
            } else {
                setResult({
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
                setResult(prev => prev ? { ...prev, vacancies: data } : null);
            }
        } catch (err) {
            console.error('Ошибка загрузки вакансий:', err);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        // Очищаем результат через 3 секунды после закрытия
        setTimeout(() => {
            setResult(null);
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
                            <h3>Результат парсинга</h3>
                            <button className={styles.closeButton} onClick={closeModal}>×</button>
                        </div>

                        <div className={styles.modalBody}>
                            {error && (
                                <div className={styles.error}>
                                    ❌ {error}
                                </div>
                            )}

                            {result && (
                                <>
                                    {result.success ? (
                                        <div className={styles.success}>
                                            ✅ {result.message}
                                            {result.jobsCount !== undefined && (
                                                <p>📊 Найдено вакансий: <strong>{result.jobsCount}</strong></p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className={styles.error}>
                                            ❌ {result.message}
                                        </div>
                                    )}

                                    {result.vacancies && result.vacancies.length > 0 && (
                                        <div className={styles.vacanciesList}>
                                            <h4>📋 Последние вакансии:</h4>
                                            <div className={styles.vacanciesScroll}>
                                                {result.vacancies.slice(0, 10).map((vacancy, idx) => (
                                                    <div key={idx} className={styles.vacancyItem}>
                                                        <div className={styles.vacancyProfession}>{vacancy.profession}</div>
                                                        <div className={styles.vacancyDetails}>
                                                            <span>💰 {vacancy.salary || 'не указана'}</span>
                                                            <span>📍 {vacancy.district}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {result.vacancies.length > 10 && (
                                                    <div className={styles.moreInfo}>
                                                        ...и еще {result.vacancies.length - 10} вакансий
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {!error && !result && (
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