// app/vacancy/_components/VacancyForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import s from './VacancyForm.module.css';
import styles from "@/app/Main/Modal.module.css";
import { useAuth } from '@/app/_context/AuthContext'; // 🌟 СЕНЬОР-ФИКС: Импортируем хук авторизации

interface VacancyFormProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormErrors {
    profession?: string[];
    organization?: string[];
    salary?: string[];
    district?: string[];
    schedule?: string[];
    description?: string[];
    requirements?: string[];
    global?: string;
}

export default function VacancyForm({ isOpen, onClose }: VacancyFormProps) {
    const { user } = useAuth(); // 🌟 СЕНЬОР-ФИКС: Достаем текущего юзера (имитацию Яндекса)

    const [profession, setProfession] = useState('');
    const [salary, setSalary] = useState('');
    const [organization, setOrganization] = useState('');
    const [district, setDistrict] = useState('');
    const [schedule, setSchedule] = useState('');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');
    const [hpEmail, setHpEmail] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) handleCloseForm();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!profession.trim() || !organization.trim() || !description.trim()) {
            setErrors({ global: 'Пожалуйста, заполните все обязательные поля (*).' });
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch('/vacancy/api/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // 🌟 СЕНЬОР-ФИКС: Передаем реальный анонимный ID из нашей HttpOnly куки.
                    // Если сессия еще загружается, временно передаем пустую строку.
                    author_id: user?.id || '',
                    profession,
                    salary: salary || undefined,
                    organization,
                    district: district || undefined,
                    schedule: schedule || undefined,
                    description,
                    requirements: requirements || undefined,
                    hpEmail: hpEmail
                }),
            });


            const data = await response.json();

            if (!response.ok) {
                if (data.details) {
                    setErrors(data.details);
                } else {
                    setErrors({ global: data.error || 'Что-то пошло не так.' });
                }
                return;
            }

            // Если всё успешно — очищаем поля и закрываем форму
            setProfession('');
            setSalary('');
            setOrganization('');
            setDistrict('');
            setSchedule('');
            setDescription('');
            setRequirements('');
            setHpEmail('');
            handleCloseForm();

        } catch (err) {
            console.error(err);
            setErrors({ global: 'Ошибка сети. Попробуйте позже.' });
        } finally {
            setSubmitting(false);
        }
    };

    // ... далее ваш неизмененный JSX разметки формы

    const handleCloseForm = () => {
        onClose(); // setIsFormOpen(false) из родителя
        setErrors({}); // Очищаем ошибки при закрытии окна

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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, pointerEvents: 'none' }}
                        transition={{ type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.45 }}
                        onClick={handleCloseForm}
                        className={styles.overlayNode}
                    />

                    {/* 🌟 ТОЧНАЯ КОПИЯ ФИЗИКИ ПРУЖИНЫ ИЗ ВАШЕЙ ШТОРКИ */}
                    <motion.div
                        className={s.modalSheet}
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 260, mass: 0.8 }}
                    >
                        <div className={s.content}>
                            {/* Имитируем dragHandle шторки для визуальной симметрии */}
                            <div className={s.dragHandle} onClick={handleCloseForm} style={{
                                width: '40px',
                                height: '5px',
                                backgroundColor: '#3f3f46',
                                borderRadius: '3px',
                                margin: '0 auto 15px auto',
                                cursor: 'pointer'
                            }} />

                            <div className={s.modalHeader}>
                                <h2>Добавить вакансию</h2>
                                <button type="button" className={s.closeButton}
                                        onClick={handleCloseForm}>&times;</button>
                            </div>

                            {/* Глобальная ошибка формы (сетевая или пустые поля) */}
                            {errors.global && <div className={s.globalError}>{errors.global}</div>}

                            <form className={s.form} onSubmit={handleSubmit}>
                                <div style={{
                                    position: 'absolute',
                                    opacity: 0,
                                    zIndex: -1,
                                    width: 0,
                                    height: 0,
                                    overflow: 'hidden'
                                }}>
                                    <label htmlFor="hp_email">Do not fill this field if you are human</label>
                                    <input
                                        id="hp_email"
                                        type="text"
                                        name="hp_email"
                                        value={hpEmail}
                                        onChange={(e) => setHpEmail(e.target.value)}
                                        tabIndex={-1} // Чтобы пользователь не попал кнопкой Tab
                                        autoComplete="off"
                                    />
                                </div>
                                <div className={s.fieldGroup}>
                                    <label>Должность *</label>
                                    <input type="text" className={s.input} value={profession}
                                           onChange={(e) => setProfession(e.target.value)} maxLength={100}/>
                                    {errors.profession && <span className={s.fieldError}>{errors.profession[0]}</span>}
                                </div>
                                <div className={s.fieldGroup}>
                                    <label>Компания / ИП *</label>
                                    <input type="text" className={s.input} value={organization}
                                           onChange={(e) => setOrganization(e.target.value)} maxLength={100}/>
                                    {errors.organization &&
                                        <span className={s.fieldError}>{errors.organization[0]}</span>}
                                </div>
                                <div className={s.fieldGroup}>
                                    <label>Зарплата (₽)</label>
                                    <input type="text" className={s.input} value={salary}
                                           onChange={(e) => setSalary(e.target.value)} maxLength={30}/>
                                    {errors.salary && <span className={s.fieldError}>{errors.salary[0]}</span>}
                                </div>
                                <div className={s.fieldGroup}>
                                    <label>Район / Город</label>
                                    <input type="text" className={s.input} value={district}
                                           onChange={(e) => setDistrict(e.target.value)} maxLength={100}/>
                                    {errors.district && <span className={s.fieldError}>{errors.district[0]}</span>}
                                </div>
                                <div className={s.fieldGroup}>
                                    <label>График работы</label>
                                    <input type="text" className={s.input} value={schedule}
                                           onChange={(e) => setSchedule(e.target.value)} maxLength={50}/>
                                    {errors.schedule && <span className={s.fieldError}>{errors.schedule[0]}</span>}
                                </div>
                                <div className={s.fieldGroup}>
                                    <label>Описание обязанностей *</label>
                                    <textarea className={s.textarea} value={description}
                                              onChange={(e) => setDescription(e.target.value)} maxLength={3000}/>
                                    {errors.description &&
                                        <span className={s.fieldError}>{errors.description[0]}</span>}
                                </div>
                                <div className={s.fieldGroup}>
                                    <label>Requirements</label>
                                    <textarea className={s.textarea} value={requirements}
                                              onChange={(e) => setRequirements(e.target.value)} maxLength={2000}/>
                                    {errors.requirements && <span className={s.fieldError}>{errors.requirements}</span>}
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