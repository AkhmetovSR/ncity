'use client';
import s from './VacancyInfo.module.css';
import { motion } from "framer-motion";
import { useRef } from "react";
import { Vacancy } from "@/types/vacancy";

interface VacancyInfoProps {
    vacancy?: Vacancy;
    onClose?: () => void;
}

export default function VacancyInfo({ vacancy, onClose }: VacancyInfoProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    if (!vacancy) return null;

    return (
        <>
            {/* Затемнённый фон */}
            <motion.div
                className={s.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                transition={{ duration: 0.2 }}
            />

            {/* Панель с информацией */}
            <motion.div
                className={s.vacancyInfo}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                ref={contentRef}
                drag="y"
                dragDirectionLock
                dragConstraints={{ top: 0 }}
                dragElastic={{ top: 0, bottom: 0.2 }}
                onDragEnd={(e, { offset, velocity }) => {
                    if (offset.y > 100 || velocity.y > 500) {
                        onClose?.();
                    }
                }}
            >
                {/* Индикатор свайпа */}
                <div className={s.swipeIndicator}>
                    <div className={s.swipeBar} />
                </div>

                <div className={s.header}>
                    <div className={s.headerContent}>
                        <div className={s.divTitle}>
                            <h2 className={s.title}>{vacancy.profession}</h2>
                            <button className={s.closeButton} onClick={onClose}>✕</button>
                        </div>
                        {vacancy.salary && (
                            <motion.div className={s.salaryBox}>
                                <span className={s.salaryIcon}>🪙 </span>
                                <span className={s.salaryValue}>{vacancy.salary} ₽</span>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Скроллящийся контент */}
                <div className={s.content}>
                    <motion.div
                        className={s.infoGrid}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                    >
                        {vacancy.date && (
                            <div className={s.infoCard}>
                                <div className={s.infoIcon}>📅</div>
                                <div className={s.infoContent}>
                                    <div className={s.infoLabel}>Дата публикации</div>
                                    <div className={s.infoValue}>{vacancy.date}</div>
                                </div>
                            </div>
                        )}
                        {vacancy.organization && (
                            <div className={s.infoCard}>
                                <div className={s.infoIcon}>🏢</div>
                                <div className={s.infoContent}>
                                    <div className={s.infoLabel}>Организация</div>
                                    <div className={s.infoValue}>{vacancy.organization}</div>
                                </div>
                            </div>
                        )}
                        {vacancy.district && (
                            <div className={s.infoCard}>
                                <div className={s.infoIcon}>📍</div>
                                <div className={s.infoContent}>
                                    <div className={s.infoLabel}>Регион</div>
                                    <div className={s.infoValue}>{vacancy.district}</div>
                                </div>
                            </div>
                        )}
                        {vacancy.address && (
                            <div className={s.infoCard}>
                                <div className={s.infoIcon}>🏠</div>
                                <div className={s.infoContent}>
                                    <div className={s.infoLabel}>Адрес</div>
                                    <div className={s.infoValue}>{vacancy.address}</div>
                                </div>
                            </div>
                        )}
                        {vacancy.schedule && (
                            <div className={s.infoCard}>
                                <div className={s.infoIcon}>⏰</div>
                                <div className={s.infoContent}>
                                    <div className={s.infoLabel}>График работы</div>
                                    <div className={s.infoValue}>{vacancy.schedule}</div>
                                </div>
                            </div>
                        )}
                        {vacancy.busyType && (
                            <div className={s.infoCard}>
                                <div className={s.infoIcon}>💼</div>
                                <div className={s.infoContent}>
                                    <div className={s.infoLabel}>Тип занятости</div>
                                    <div className={s.infoValue}>{vacancy.busyType}</div>
                                </div>
                            </div>
                        )}
                        {vacancy.experience && (
                            <div className={s.infoCard}>
                                <div className={s.infoIcon}>📊</div>
                                <div className={s.infoContent}>
                                    <div className={s.infoLabel}>Опыт работы</div>
                                    <div className={s.infoValue}>{vacancy.experience}</div>
                                </div>
                            </div>
                        )}
                        {vacancy.education && (
                            <div className={s.infoCard}>
                                <div className={s.infoIcon}>🎓</div>
                                <div className={s.infoContent}>
                                    <div className={s.infoLabel}>Образование</div>
                                    <div className={s.infoValue}>{vacancy.education}</div>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {(vacancy.phone || vacancy.email || vacancy.website) && (
                        <motion.div
                            className={s.contactsSection}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3 className={s.sectionTitle}>
                                <span className={s.sectionIcon}>📞</span>
                                Контакты для связи
                            </h3>
                            <div className={s.contactsGrid}>
                                {vacancy.phone && (
                                    <motion.a
                                        href={`tel:${vacancy.phone}`}
                                        className={s.contactCard}
                                        whileHover={{ x: 5, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className={s.contactIcon}>📱</span>
                                        <div className={s.contactInfo}>
                                            <div className={s.contactLabel}>Телефон</div>
                                            <div className={s.contactValue}>{vacancy.phone}</div>
                                        </div>
                                        <span className={s.contactArrow}>→</span>
                                    </motion.a>
                                )}
                                {vacancy.email && (
                                    <motion.a
                                        href={`mailto:${vacancy.email}`}
                                        className={s.contactCard}
                                        whileHover={{ x: 5, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className={s.contactIcon}>✉️</span>
                                        <div className={s.contactInfo}>
                                            <div className={s.contactLabel}>Email</div>
                                            <div className={s.contactValue}>{vacancy.email}</div>
                                        </div>
                                        <span className={s.contactArrow}>→</span>
                                    </motion.a>
                                )}
                                {vacancy.website && (
                                    <motion.a
                                        href={vacancy.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={s.contactCard}
                                        whileHover={{ x: 5, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className={s.contactIcon}>🌐</span>
                                        <div className={s.contactInfo}>
                                            <div className={s.contactLabel}>Сайт</div>
                                            <div className={s.contactValue}>{vacancy.website}</div>
                                        </div>
                                        <span className={s.contactArrow}>→</span>
                                    </motion.a>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Описание — просто вставляем HTML */}
                    {vacancy.description && (
                        <motion.div
                            className={s.section}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                        >
                            <h3 className={s.sectionTitle}>
                                <span className={s.sectionIcon}>📝</span>
                                Описание вакансии
                            </h3>
                            <div
                                className={s.contentBox}
                                dangerouslySetInnerHTML={{ __html: vacancy.description }}
                            />
                        </motion.div>
                    )}

                    {/* Требования — просто вставляем HTML */}
                    {vacancy.requirements && (
                        <motion.div
                            className={s.section}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h3 className={s.sectionTitle}>
                                <span className={s.sectionIcon}>⚡</span>
                                Требования к кандидату
                            </h3>
                            <div
                                className={s.contentBox}
                                dangerouslySetInnerHTML={{ __html: vacancy.requirements }}
                            />
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </>
    );
}