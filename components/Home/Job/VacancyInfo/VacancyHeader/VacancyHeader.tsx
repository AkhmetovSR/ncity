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

Контактная информация для связи:
• ФИО: [Ваше ФИО]
• Телефон: [Ваш номер телефона]
• Email: [Ваш email]

Резюме прикрепляю к письму.

Буду рад(а) возможности пройти собеседование.

С уважением,
[Ваше ФИО]
        `.trim());

        window.location.href = `mailto:${vacancy.email || ''}?subject=${subject}&body=${body}`;
    };

    return (
        <div className={s.header}>
            <div className={s.swipeIndicator}>
                <div className={s.swipeBar} />
            </div>
            <div className={s.headerContent}>
                <div className={s.divTitle}>
                    <div className={s.divProfession}><h2 className={s.title}>{vacancy?.profession}</h2></div>
                    <button className={s.closeButton} onClick={onClose}>✕</button>
                </div>
                {vacancy?.salary && (
                    <motion.div className={s.salaryBox}>
                        <span className={s.salaryIcon}>🪙 </span>
                        <span className={s.salaryValue}>{vacancy?.salary} ₽</span>
                    </motion.div>
                )}
                {/* Кнопка отправки резюме */}
                <motion.button
                    className={s.sendResumeButton}
                    onClick={handleSendResume}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <span className={s.sendIcon}>📎</span>
                    Отправить резюме
                    <span className={s.arrowIcon}>→</span>
                </motion.button>
            </div>

        </div>
    );
}