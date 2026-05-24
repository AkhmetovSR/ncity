'use client';
import s from '@/components/Home/Job/VacancyInfo/VacancyContent/VacancyContent.module.css';
import { useEffect, useRef, useState } from "react";
import { Vacancy } from "@/types/vacancy";

interface VacancyInfoProps {
    vacancy?: Vacancy;
    onClose?: () => void;
    onScrollTopChange?: (isAtTop: boolean) => void; // 👈 новый проп
}

export default function VacancyContent({ vacancy, onClose, onScrollTopChange }: VacancyInfoProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [isAtTop, setIsAtTop] = useState(true);

    // Отслеживание скролла
    useEffect(() => {
        const element = contentRef.current;
        if (!element) return;

        const handleScroll = () => {
            const atTop = element.scrollTop <= 5;
            setIsAtTop(atTop);
            onScrollTopChange?.(atTop); // 👈 сообщаем родителю
        };

        handleScroll();
        element.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            element.removeEventListener('scroll', handleScroll);
        };
    }, [onScrollTopChange]);

    return (
        <div
            className={s.content}
            ref={contentRef}
            style={{
                overflowY: 'auto',
                touchAction: 'pan-y',
                WebkitOverflowScrolling: 'touch', // сохраняем плавность
                overscrollBehavior: 'contain' // 👈 главное - запрещаем баунс
            }}
        >
            {/* INFO GRID */}
            <div className={s.infoGrid}>
                {vacancy?.date && (
                    <div className={s.infoCard}>
                        <div className={s.infoIcon}>📅</div>
                        <div className={s.infoContent}>
                            <div className={s.infoLabel}>Дата публикации</div>
                            <div className={s.infoValue}>{vacancy.date}</div>
                        </div>
                    </div>
                )}
                {vacancy?.organization && (
                    <div className={s.infoCard}>
                        <div className={s.infoIcon}>🏢</div>
                        <div className={s.infoContent}>
                            <div className={s.infoLabel}>Организация</div>
                            <div className={s.infoValue}>{vacancy.organization}</div>
                        </div>
                    </div>
                )}
                {vacancy?.district && (
                    <div className={s.infoCard}>
                        <div className={s.infoIcon}>📍</div>
                        <div className={s.infoContent}>
                            <div className={s.infoLabel}>Регион</div>
                            <div className={s.infoValue}>{vacancy.district}</div>
                        </div>
                    </div>
                )}
                {vacancy?.address && (
                    <div className={s.infoCard}>
                        <div className={s.infoIcon}>🏠</div>
                        <div className={s.infoContent}>
                            <div className={s.infoLabel}>Адрес</div>
                            <div className={s.infoValue}>{vacancy.address}</div>
                        </div>
                    </div>
                )}
                {vacancy?.schedule && (
                    <div className={s.infoCard}>
                        <div className={s.infoIcon}>⏰</div>
                        <div className={s.infoContent}>
                            <div className={s.infoLabel}>График работы</div>
                            <div className={s.infoValue}>{vacancy.schedule}</div>
                        </div>
                    </div>
                )}
                {vacancy?.busyType && (
                    <div className={s.infoCard}>
                        <div className={s.infoIcon}>💼</div>
                        <div className={s.infoContent}>
                            <div className={s.infoLabel}>Тип занятости</div>
                            <div className={s.infoValue}>{vacancy.busyType}</div>
                        </div>
                    </div>
                )}
                {vacancy?.experience && (
                    <div className={s.infoCard}>
                        <div className={s.infoIcon}>📊</div>
                        <div className={s.infoContent}>
                            <div className={s.infoLabel}>Опыт работы</div>
                            <div className={s.infoValue}>{vacancy.experience}</div>
                        </div>
                    </div>
                )}
                {vacancy?.education && (
                    <div className={s.infoCard}>
                        <div className={s.infoIcon}>🎓</div>
                        <div className={s.infoContent}>
                            <div className={s.infoLabel}>Образование</div>
                            <div className={s.infoValue}>{vacancy.education}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* CONTACTS SECTION */}
            {(vacancy?.phone || vacancy?.email || vacancy?.website) && (
                <div className={s.contactsSection}>
                    <h3 className={s.sectionTitle}>
                        <span className={s.sectionIcon}>📞</span>
                        Контакты для связи
                    </h3>
                    <div className={s.contactsGrid}>
                        {vacancy.phone && (
                            <a href={`tel:${vacancy.phone}`} className={s.contactCard}>
                                <span className={s.contactIcon}>📱</span>
                                <div className={s.contactInfo}>
                                    <div className={s.contactLabel}>Телефон</div>
                                    <div className={s.contactValue}>{vacancy.phone}</div>
                                </div>
                                <span className={s.contactArrow}>→</span>
                            </a>
                        )}
                        {vacancy.email && (
                            <a href={`mailto:${vacancy.email}`} className={s.contactCard}>
                                <span className={s.contactIcon}>✉️</span>
                                <div className={s.contactInfo}>
                                    <div className={s.contactLabel}>Email</div>
                                    <div className={s.contactValue}>{vacancy.email}</div>
                                </div>
                                <span className={s.contactArrow}>→</span>
                            </a>
                        )}
                        {vacancy.website && (
                            <a
                                href={vacancy.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={s.contactCard}
                            >
                                <span className={s.contactIcon}>🌐</span>
                                <div className={s.contactInfo}>
                                    <div className={s.contactLabel}>Сайт</div>
                                    <div className={s.contactValue}>{vacancy.website}</div>
                                </div>
                                <span className={s.contactArrow}>→</span>
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* DESCRIPTION SECTION */}
            {vacancy?.description && (
                <div className={s.section}>
                    <h3 className={s.sectionTitle}>
                        <span className={s.sectionIcon}>📝</span>
                        Описание вакансии
                    </h3>
                    <div
                        className={s.contentBox}
                        dangerouslySetInnerHTML={{ __html: vacancy.description }}
                    />
                </div>
            )}

            {/* REQUIREMENTS SECTION */}
            {vacancy?.requirements && (
                <div className={s.section}>
                    <h3 className={s.sectionTitle}>
                        <span className={s.sectionIcon}>⚡</span>
                        Требования к кандидату
                    </h3>
                    <div
                        className={s.contentBox}
                        dangerouslySetInnerHTML={{ __html: vacancy.requirements }}
                    />
                </div>
            )}
        </div>
    );
}