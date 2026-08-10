'use client';

import s from '@/components/Home/Job/VacancyInfo/VacancyHeader/VacancyHeader.module.css';
import { motion } from "framer-motion";
import { Vacancy } from "@/types/vacancy";

interface VacancyInfoProps {
    vacancy?: Vacancy;
    onClose?: () => void;
}

export default function VacancyHeader({ vacancy, onClose }: VacancyInfoProps) {

    const handleSendResume = () => {
        if (!vacancy) return;

        const subject = encodeURIComponent(`Резюме на вакансию: ${vacancy.profession}`);
        const body = encodeURIComponent(`
Здравствуйте!

Меня заинтересовала вакансия "${vacancy.profession}".
Направляю Вам своё резюме на рассмотрение.

С уважением,
[Ваше ФИО]
        `.trim());

        window.location.href = `mailto:${vacancy.email || ''}?subject=${subject}&body=${body}`;
    };

    return (
        <div className={s.header}>
            {/* Нативный аккуратный индикатор для шторки */}
            <div className={s.dragHandle} />

            <div className={s.mainLayout}>
                {/* Информационный блок */}
                <div className={s.metaStack}>
                    <h2 className={s.title}>{vacancy?.profession || 'Вакансия'}</h2>

                    {vacancy?.salary && (
                        <div className={s.salaryBadge}>
                            {Number(vacancy.salary).toLocaleString('ru-RU')} ₽
                        </div>
                    )}
                </div>

                {/* Блок интерактивных элементов */}
                <div className={s.actionGroup}>
                    <motion.button
                        className={s.sendResumeButton}
                        onClick={handleSendResume}
                        whileTap={{ scale: 0.96 }}
                    >
                        Откликнуться
                    </motion.button>

                    <button className={s.closeButton} onClick={onClose} aria-label="Закрыть">
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
}
