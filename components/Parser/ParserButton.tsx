'use client';
import { useState } from 'react';
import styles from './ParserButton.module.css';
import VacancyEditor from "@/components/Parser/VacancyEditor";

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
    // Добавьте в компонент
    const [showEditor, setShowEditor] = useState(false);
    const [rawVacancies, setRawVacancies] = useState<Vacancy[]>([]);
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
    // Функция парсинга с редактированием
    const parseWithEdit = async (mode: Mode) => {
        setIsLoading(true);
        setShowParseModal(false);

        try {
            const response = await fetch(`/api/parse?mode=${mode}&action=edit`);
            const data = await response.json();

            if (data.success && data.vacancies) {
                setRawVacancies(data.vacancies);
                setShowEditor(true);
            } else {
                // Показать ошибку
                setResultType('error');
                setResultMessage(data.error || 'Ошибка парсинга');
                setShowResultModal(true);
            }
        } catch (err: any) {
            setResultType('error');
            setResultMessage(`Ошибка: ${err.message}`);
            setShowResultModal(true);
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
    // Функция сохранения после редактирования
    const saveEditedVacancies = async (editedVacancies: Vacancy[]) => {
        setShowEditor(false);
        setIsLoading(true);

        try {
            const response = await fetch('/api/parse/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vacancies: editedVacancies })
            });

            const data = await response.json();

            if (data.success) {
                setResultType('success');
                setResultMessage(`✅ Сохранено ${editedVacancies.length} вакансий`);
                await loadVacancies();
            } else {
                setResultType('error');
                setResultMessage(data.error || 'Ошибка сохранения');
            }
            setShowResultModal(true);
        } catch (err: any) {
            setResultType('error');
            setResultMessage(`Ошибка: ${err.message}`);
            setShowResultModal(true);
        } finally {
            setIsLoading(false);
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
                        <button className={styles.modeButton} onClick={() => parseWithEdit('local')}>
                            <span className={styles.modeIcon}>💻</span>
                            <div>
                                <strong>Локальный режим</strong>
                                <small>Парсить из папки pages/</small>
                            </div>
                        </button>

                        <button className={styles.modeButton} onClick={() => parseWithEdit('vercel')}>
                            <span className={styles.modeIcon}>☁️</span>
                            <div>
                                <strong>Vercel режим</strong>
                                <small>Парсить из /tmp на Vercel</small>
                            </div>
                        </button>

                        <button className={styles.modeButton} onClick={() => parseWithEdit('online')}>
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
                <button className={`${styles.button} ${styles.downloadButton}`} onClick={() => setShowDownloadModal(true)}>
                    📥 Скачать страницы
                </button>
                <button className={`${styles.button} ${styles.parseButton}`} onClick={() => setShowParseModal(true)}>
                    🔍 Парсить вакансии
                </button>
            </div>

            {/* Модальные окна выбора режима */}
            {showDownloadModal && <DownloadModeModal />}
            {showParseModal && <ParseModeModal />}

            {/* ✅ Редактор — ОТДЕЛЬНОЕ модальное окно (не внутри resultModal) */}
            {showEditor && (
                <VacancyEditor
                    vacancies={rawVacancies}
                    onSave={saveEditedVacancies}
                    onCancel={() => setShowEditor(false)}
                />
            )}

            {/* Модальное окно результатов — ТОЛЬКО для сообщений */}
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