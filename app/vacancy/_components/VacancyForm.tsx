// app/vacancy/_components/VacancyForm.tsx
'use client';

import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import s from './VacancyForm.module.css';
import styles from "@/app/Main/Modal.module.css"; // Импортируем ваши стили overlayNode

interface VacancyFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function VacancyForm({isOpen, onClose}: VacancyFormProps) {
    const [profession, setProfession] = useState('');
    const [salary, setSalary] = useState('');
    const [organization, setOrganization] = useState('');
    const [district, setDistrict] = useState('');
    const [schedule, setSchedule] = useState('');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');

    const [submitting, setSubmitting] = useState(false);

    // Блокировка скролла страницы при открытии формы (как в шторке)
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Слушатель клавиши Escape для закрытия формы (как в шторке)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profession.trim() || !organization.trim() || !description.trim()) {
            alert('Пожалуйста, заполните обязательные поля.');
            return;
        }

        setSubmitting(true);
        try {
            console.log('Отправка на модерацию:', {
                profession,
                salary,
                organization,
                district,
                schedule,
                description,
                requirements
            });
            await new Promise(resolve => setTimeout(resolve, 1000));

            setProfession('');
            setSalary('');
            setOrganization('');
            setDistrict('');
            setSchedule('');
            setDescription('');
            setRequirements('');

            onClose();
            alert('Вакансия отправлена на модерацию!');
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseForm = () => {
        onClose(); // setIsFormOpen(false) из родителя

        // Если в URL висит параметр формы, откатываем историю на один шаг назад
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('add')) {
            window.history.back();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* 🌟 ТОЧНАЯ КОПИЯ АНИМАЦИИ ФОНА ИЗ ВАШЕЙ ШТОРКИ */}
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0, pointerEvents: 'none'}}
                        transition={{type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.45}}
                        onClick={handleCloseForm}
                        className={styles.overlayNode}
                    />

                    {/* 🌟 ТОЧНАЯ КОПИЯ ФИЗИКИ ПРУЖИНЫ ИЗ ВАШЕЙ ШТОРКИ */}
                    <motion.div
                        className={s.modalSheet}
                        initial={{y: '100%'}}
                        animate={{y: 0}}
                        exit={{y: '100%'}}
                        transition={{type: 'spring', damping: 30, stiffness: 260, mass: 0.8}}
                    >
                        <div className={s.content}>
                            {/* Имитируем dragHandle шторки для визуальной симметрии */}
                            <div className={s.dragHandle} onClick={onClose} style={{
                                width: '40px',
                                height: '5px',
                                backgroundColor: '#3f3f46',
                                borderRadius: '3px',
                                margin: '0 auto 15px auto',
                                cursor: 'pointer'
                            }}/>

                            <div className={s.modalHeader}>
                                <h2>Добавить вакансию</h2>
                                <button type="button" className={s.closeButton}
                                        onClick={handleCloseForm}>&times;</button>
                            </div>

                            <form className={s.form} onSubmit={handleSubmit}>
                                <div className={s.fieldGroup}>
                                    <label>Должность *</label>
                                    <input type="text" className={s.input} value={profession}
                                           onChange={(e) => setProfession(e.target.value)} maxLength={100}/>
                                </div>
                                <div className={s.fieldGroup}>
                                    <label>Компания / ИП *</label>
                                    <input type="text" className={s.input} value={organization}
                                           onChange={(e) => setOrganization(e.target.value)} maxLength={100}/>
                                </div>
                                <div className={s.fieldGroup}>
                                    <label>Зарплата (₽)</label>
                                    <input type="text" className={s.input} value={salary}
                                           onChange={(e) => setSalary(e.target.value)} maxLength={30}/>
                                </div>
                                <div className={s.fieldGroup}>
                                    <label>Район / Город</label>
                                    <input type="text" className={s.input} value={district}
                                           onChange={(e) => setDistrict(e.target.value)} maxLength={100}/>
                                </div>
                                <div className={s.fieldGroup}>
                                    <label>График работы</label>
                                    <input type="text" className={s.input} value={schedule}
                                           onChange={(e) => setSchedule(e.target.value)} maxLength={50}/>
                                </div>
                                <div className={s.fieldGroup}>
                                    <label>Описание обязанностей *</label>
                                    <textarea className={s.textarea} value={description}
                                              onChange={(e) => setDescription(e.target.value)} maxLength={3000}/>
                                </div>
                                <div className={s.fieldGroup}>
                                    <label>Requirements</label>
                                    <textarea className={s.textarea} value={requirements}
                                              onChange={(e) => setRequirements(e.target.value)} maxLength={2000}/>
                                </div>

                                <button type="submit" className={s.submitButton} disabled={submitting}>
                                    {submitting ? 'Отправка...' : 'Отправить на модерацию'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
