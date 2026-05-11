'use client';
import { useState } from 'react';
import styles from './VacancyEditor.module.css';

interface Vacancy {
    page: number;
    profession: string;
    salary: string;
    district: string;
    organization: string;
    date: string;
    schedule: string;
    _id?: number;
}

interface VacancyEditorProps {
    vacancies: Vacancy[];
    onSave: (editedVacancies: Vacancy[]) => void;
    onCancel: () => void;
}

export default function VacancyEditor({ vacancies, onSave, onCancel }: VacancyEditorProps) {
    const [editedVacancies, setEditedVacancies] = useState<Vacancy[]>(
        vacancies.map((v, idx) => ({ ...v, _id: idx }))
    );
    const [skippedIds, setSkippedIds] = useState<Set<number>>(new Set());

    const updateVacancy = (id: number, field: keyof Vacancy, value: string) => {
        setEditedVacancies(prev =>
            prev.map(v =>
                v._id === id ? { ...v, [field]: value } : v
            )
        );
    };

    const toggleSkip = (id: number) => {
        setSkippedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleSave = () => {
        // Фильтруем пропущенные вакансии
        const toSave = editedVacancies.filter(v => !skippedIds.has(v._id!));
        onSave(toSave);
    };

    const visibleVacancies = editedVacancies;
    const keptCount = visibleVacancies.length - skippedIds.size;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3>✏️ Редактирование вакансий</h3>
                    <button className={styles.closeButton} onClick={onCancel}>×</button>
                </div>

                <div className={styles.stats}>
                    <span>📊 Всего: {visibleVacancies.length}</span>
                    <span>✅ Сохранится: {keptCount}</span>
                    <span>⏭️ Пропущено: {skippedIds.size}</span>
                </div>

                <div className={styles.vacanciesList}>
                    {visibleVacancies.map((vacancy) => {
                        const isSkipped = skippedIds.has(vacancy._id!);

                        return (
                            <div
                                key={vacancy._id}
                                className={`${styles.vacancyCard} ${isSkipped ? styles.skipped : ''}`}
                            >
                                <div className={styles.cardHeader}>
                                    <span className={styles.vacancyNumber}>#{vacancy._id! + 1}</span>
                                    <button
                                        className={styles.skipButton}
                                        onClick={() => toggleSkip(vacancy._id!)}
                                    >
                                        {isSkipped ? '↩️ Вернуть' : '⏭️ Пропустить'}
                                    </button>
                                </div>

                                <div className={styles.fields}>
                                    <div className={styles.field}>
                                        <label>Профессия:</label>
                                        <input
                                            type="text"
                                            value={vacancy.profession}
                                            onChange={(e) => updateVacancy(vacancy._id!, 'profession', e.target.value)}
                                            disabled={isSkipped}
                                            className={isSkipped ? styles.disabled : ''}
                                        />
                                    </div>

                                    <div className={styles.fieldRow}>
                                        <div className={styles.field}>
                                            <label>Зарплата:</label>
                                            <input
                                                type="text"
                                                value={vacancy.salary}
                                                onChange={(e) => updateVacancy(vacancy._id!, 'salary', e.target.value)}
                                                disabled={isSkipped}
                                                className={isSkipped ? styles.disabled : ''}
                                            />
                                        </div>

                                        <div className={styles.field}>
                                            <label>Район:</label>
                                            <input
                                                type="text"
                                                value={vacancy.district}
                                                onChange={(e) => updateVacancy(vacancy._id!, 'district', e.target.value)}
                                                disabled={isSkipped}
                                                className={isSkipped ? styles.disabled : ''}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.fieldRow}>
                                        <div className={styles.field}>
                                            <label>Организация:</label>
                                            <input
                                                type="text"
                                                value={vacancy.organization}
                                                onChange={(e) => updateVacancy(vacancy._id!, 'organization', e.target.value)}
                                                disabled={isSkipped}
                                                className={isSkipped ? styles.disabled : ''}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.fieldRow}>
                                        <div className={styles.field}>
                                            <label>Дата:</label>
                                            <input
                                                type="text"
                                                value={vacancy.date}
                                                onChange={(e) => updateVacancy(vacancy._id!, 'date', e.target.value)}
                                                disabled={isSkipped}
                                                className={isSkipped ? styles.disabled : ''}
                                            />
                                        </div>

                                        <div className={styles.field}>
                                            <label>График:</label>
                                            <input
                                                type="text"
                                                value={vacancy.schedule}
                                                onChange={(e) => updateVacancy(vacancy._id!, 'schedule', e.target.value)}
                                                disabled={isSkipped}
                                                className={isSkipped ? styles.disabled : ''}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelButton} onClick={onCancel}>
                        Отмена
                    </button>
                    <button className={styles.saveButton} onClick={handleSave}>
                        💾 Сохранить ({keptCount} вакансий)
                    </button>
                </div>
            </div>
        </div>
    );
}