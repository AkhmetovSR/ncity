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

type Mode = 'local' | 'vercel' | 'online';

export default function ParserButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [showParseModal, setShowParseModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [resultMessage, setResultMessage] = useState('');
    const [resultType, setResultType] = useState<'success' | 'error' | 'info'>('info');
    const [currentAction, setCurrentAction] = useState<'download' | 'parse'>('download');

    // Скачивание страниц
    const downloadPages = async (mode: Mode) => {
        setShowDownloadModal(false);
        setIsLoading(true);
        setResultType('info');
        setResultMessage(`🔄 Скачивание страниц (режим: ${getModeName(mode)})...`);
        setShowResultModal(true);

        try {
            const response = await fetch(`/api/download?mode=${mode}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (data.success) {
                setResultType('success');
                setResultMessage(
                    `✅ ${data.message}\n` +
                    `📁 Режим: ${getModeName(mode)}\n` +
                    `📍 Папка: ${data.pagesDir || 'не используется'}\n` +
                    `📄 Скачано страниц: ${data.downloadedPages?.length || 10}`
                );
            } else {
                setResultType('error');
                setResultMessage(`❌ Ошибка: ${data.error || 'Неизвестная ошибка'}`);
            }
        } catch (err: any) {
            setResultType('error');
            setResultMessage(`❌ Ошибка соединения: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    // Парсинг вакансий
    const parseVacancies = async (mode: Mode) => {
        setShowParseModal(false);
        setIsLoading(true);
        setResultType('info');
        setResultMessage(`🔄 Парсинг вакансий (режим: ${getModeName(mode)})...`);
        setVacancies([]);
        setShowResultModal(true);

        try {
            const response = await fetch(`/api/parse?mode=${mode}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (data.success) {
                setResultType('success');
                setResultMessage(`✅ ${data.message}\n📊 Найдено вакансий: ${data.jobsCount}`);

                // Загружаем вакансии только если парсинг успешен
                if (data.jobsCount > 0) {
                    await loadVacancies();
                }
            } else {
                setResultType('error');
                setResultMessage(`❌ ${data.error || data.message || 'Ошибка парсинга'}`);
            }
        } catch (err: any) {
            setResultType('error');
            setResultMessage(`❌ Ошибка: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Загрузка вакансий
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

    const getModeName = (mode: Mode): string => {
        switch (mode) {
            case 'local': return 'Локальный (pages/)';
            case 'vercel': return 'Vercel (/tmp)';
            case 'online': return 'Онлайн (прямой запрос)';
            default: return mode;
        }
    };
    const closeResultModal = () => {
        setShowResultModal(false);
        setTimeout(() => {
            setVacancies([]);
            setResultMessage('');
        }, 300);
    };
    // Модальное окно выбора режима для скачивания
    const DownloadModeModal = () => (
        <div className={styles.modalOverlay} onClick={() => setShowDownloadModal(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>📥 Скачать страницы</h3>
                    <button className={styles.closeButton} onClick={() => setShowDownloadModal(false)}>×</button>
                </div>

                <div className={styles.modalBody}>
                    <p className={styles.modalDescription}>Выберите куда сохранить страницы:</p>
                    <div className={styles.modeButtons}>
                        <button className={styles.modeButton} onClick={() => downloadPages('local')}>
                            <span className={styles.modeIcon}>💻</span>
                            <div>
                                <strong>Локальный режим</strong>
                                <small>Скачать в папку pages/ (для разработки)</small>
                            </div>
                        </button>

                        <button className={styles.modeButton} onClick={() => downloadPages('vercel')}>
                            <span className={styles.modeIcon}>☁️</span>
                            <div>
                                <strong>Vercel режим</strong>
                                <small>Скачать в /tmp (для продакшена)</small>
                            </div>
                        </button>

                        <button className={styles.modeButton} onClick={() => downloadPages('online')}>
                            <span className={styles.modeIcon}>🌐</span>
                            <div>
                                <strong>Онлайн режим</strong>
                                <small>Без сохранения файлов (только для просмотра)</small>
                            </div>
                        </button>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.closeModalButton} onClick={() => setShowDownloadModal(false)}>
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
    // Модальное окно выбора режима для парсинга
    const ParseModeModal = () => (
        <div className={styles.modalOverlay} onClick={() => setShowParseModal(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>🔍 Парсить вакансии</h3>
                    <button className={styles.closeButton} onClick={() => setShowParseModal(false)}>×</button>
                </div>

                <div className={styles.modalBody}>
                    <p className={styles.modalDescription}>Выберите источник для парсинга:</p>
                    <div className={styles.modeButtons}>
                        <button className={styles.modeButton} onClick={() => parseVacancies('local')}>
                            <span className={styles.modeIcon}>💻</span>
                            <div>
                                <strong>Локальный режим</strong>
                                <small>Парсить из папки pages/</small>
                            </div>
                        </button>

                        <button className={styles.modeButton} onClick={() => parseVacancies('vercel')}>
                            <span className={styles.modeIcon}>☁️</span>
                            <div>
                                <strong>Vercel режим</strong>
                                <small>Парсить из /tmp на Vercel</small>
                            </div>
                        </button>

                        <button className={styles.modeButton} onClick={() => parseVacancies('online')}>
                            <span className={styles.modeIcon}>🌐</span>
                            <div>
                                <strong>Онлайн режим</strong>
                                <small>Прямой парсинг с сайта</small>
                            </div>
                        </button>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.closeModalButton} onClick={() => setShowParseModal(false)}>
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className={styles.buttonContainer}>
                <button
                    className={`${styles.button} ${styles.downloadButton}`}
                    onClick={() => setShowDownloadModal(true)}
                    //disabled={isLoading}
                >
                    📥 Скачать страницы
                </button>

                <button
                    className={`${styles.button} ${styles.parseButton}`}
                    onClick={() => setShowParseModal(true)}
                    //disabled={isLoading}
                >
                    🔍 Парсить вакансии
                </button>
            </div>

            {/* Модальные окна выбора режима */}
            {showDownloadModal && <DownloadModeModal />}
            {showParseModal && <ParseModeModal />}

            {/* Модальное окно результатов */}
            {showResultModal && (
                <div className={styles.modalOverlay} onClick={closeResultModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>
                                {resultType === 'success' && '✅ Результат'}
                                {resultType === 'error' && '❌ Ошибка'}
                                {resultType === 'info' && '🔄 Выполнение'}
                            </h3>
                            <button className={styles.closeButton} onClick={closeResultModal}>×</button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles[resultType]}>
                                {resultMessage.split('\n').map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                            </div>

                            {/* Список вакансий (только при успешном парсинге) */}
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
                            <button className={styles.closeModalButton} onClick={closeResultModal}>
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}