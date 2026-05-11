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
    busyType: string;
}

export default function ParserButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState<'success' | 'error' | 'info' | 'loading'>('info');

    const parseVacancies = async () => {
        setIsLoading(true);
        setModalType('loading');
        setModalMessage('🔄 Парсинг вакансий с trudvsem.ru...\n\nЭто может занять до 30 секунд.');
        setShowModal(true);
        setVacancies([]);

        try {
            const response = await fetch('/api/parse', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (data.success) {
                setModalType('success');
                setModalMessage(`✅ ${data.message}\n📊 Найдено вакансий: ${data.jobsCount}\n⏱️ Время: ${data.duration || '~'}`);
                await loadVacancies();
            } else {
                setModalType('error');
                setModalMessage(`❌ Ошибка: ${data.error || 'Неизвестная ошибка'}`);
            }
        } catch (err: any) {
            setModalType('error');
            setModalMessage(`❌ Ошибка соединения: ${err.message}`);
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
            setVacancies([]);
            setModalMessage('');
        }, 300);
    };

    return (
        <>
            <div className={styles.buttonContainer}>
                <button
                    className={`${styles.button} ${styles.parseButton}`}
                    onClick={parseVacancies}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className={styles.spinner}></span>
                            Парсинг...
                        </>
                    ) : (
                        '🔍 Парсить вакансии'
                    )}
                </button>
            </div>

            {showModal && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>
                                {modalType === 'success' && '✅ Результат'}
                                {modalType === 'error' && '❌ Ошибка'}
                                {modalType === 'loading' && '🔄 Выполнение'}
                                {modalType === 'info' && 'ℹ️ Информация'}
                            </h3>
                            <button className={styles.closeButton} onClick={closeModal}>×</button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles[modalType]}>
                                {modalMessage.split('\n').map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                            </div>

                            {vacancies.length > 0 && (
                                <div className={styles.vacanciesSection}>
                                    <h4>📋 Вакансии ({vacancies.length})</h4>
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
                                                    {vacancy.busyType && (
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailIcon}>💼</span>
                                                            <span>{vacancy.busyType}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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