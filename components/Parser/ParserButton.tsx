'use client';
import { useState } from 'react';
import styles from './ParserButton.module.css';

export default function ParserButton() {
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState<'success' | 'error' | 'info' | 'loading'>('info');

    const parseVacancies = async () => {
        setModalType('loading');
        setModalMessage('🔄 Парсинг вакансий...\n\nЭто может занять некоторое время.');
        setShowModal(true);

        try {
            const response = await fetch('/api/parse-cron', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (data.success) {
                setModalType('success');
                setModalMessage(`✅ Парсинг завершен!\n📊 Найдено вакансий: ${data.count || data.jobsCount}`);
            } else {
                setModalType('error');
                setModalMessage(`❌ Ошибка: ${data.error || data.message || 'Неизвестная ошибка'}`);
            }
        } catch (err: any) {
            setModalType('error');
            setModalMessage(`❌ Ошибка соединения: ${err.message}`);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setTimeout(() => {
            setModalMessage('');
        }, 300);
    };

    return (
        <>
            <div className={styles.buttonContainer}>
                <button
                    className={`${styles.button} ${styles.parseButton}`}
                    onClick={parseVacancies}
                >
                    🔍 Парсить вакансии
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