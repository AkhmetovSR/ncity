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
    const [isDownloading, setIsDownloading] = useState(false);
    const [isParsing, setIsParsing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState<'success' | 'error' | 'info'>('info');

    // Скачивание страниц
    const downloadPages = async () => {
        setIsDownloading(true);
        setModalType('info');
        setModalMessage('🔄 Скачивание страниц...');
        setShowModal(true);

        try {
            const response = await fetch('/api/download', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (data.success) {
                setModalType('success');
                setModalMessage(`✅ ${data.message}\n📁 Папка: ${data.pagesDir}`);
            } else {
                setModalType('error');
                setModalMessage(`❌ Ошибка: ${data.error || 'Неизвестная ошибка'}`);
            }
        } catch (err: any) {
            setModalType('error');
            setModalMessage(`❌ Ошибка соединения: ${err.message}`);
        } finally {
            setIsDownloading(false);
        }
    };

    // Локальный парсинг
    const parseLocal = async () => {
        setIsParsing(true);
        setModalType('info');
        setModalMessage('🔄 Парсинг скачанных страниц...');
        setVacancies([]);
        setShowModal(true);

        try {
            // Запускаем парсер
            const response = await fetch('/api/parse-local', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (data.success) {
                setModalType('success');
                setModalMessage(`✅ ${data.message}\n📊 Найдено вакансий: ${data.jobsCount}`);

                // Загружаем спарсенные вакансии
                await loadVacancies();
            } else {
                setModalType('error');
                setModalMessage(`❌ ${data.message || data.error}`);
            }
        } catch (err: any) {
            setModalType('error');
            setModalMessage(`❌ Ошибка: ${err.message}`);
        } finally {
            setIsParsing(false);
        }
    };

    // Загрузка вакансий из результатов парсинга
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
                    className={`${styles.button} ${styles.downloadButton}`}
                    onClick={downloadPages}
                    disabled={isDownloading || isParsing}
                >
                    {isDownloading ? (
                        <>
                            <span className={styles.spinner}></span>
                            Скачивание...
                        </>
                    ) : (
                        '📥 Скачать страницы'
                    )}
                </button>

                <button
                    className={`${styles.button} ${styles.parseButton}`}
                    onClick={parseLocal}
                    disabled={isDownloading || isParsing}
                >
                    {isParsing ? (
                        <>
                            <span className={styles.spinner}></span>
                            Парсинг...
                        </>
                    ) : (
                        '🔍 Парсить локально'
                    )}
                </button>
            </div>

            {/* Модальное окно */}
            {showModal && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>
                                {modalType === 'success' && '✅ Успех'}
                                {modalType === 'error' && '❌ Ошибка'}
                                {modalType === 'info' && '🔄 Выполнение'}
                            </h3>
                            <button className={styles.closeButton} onClick={closeModal}>×</button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles[modalType]}>
                                {modalMessage}
                            </div>

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