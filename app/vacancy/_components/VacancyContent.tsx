// app/vacancy/_components/VacancyContent.tsx
'use client';

import { Vacancy } from "@/types/vacancy";
import { useScrollTop } from "@/app/vacancy/_hooks/useScrollTop";
import s from '@/app/vacancy/_components/VacancyContent.module.css';

interface VacancyContentProps {
    vacancy?: Vacancy;
    onScrollTopChange?: (isAtTop: boolean) => void;
}

// 🌟 СЕНЬОР-ФИКС: Убрали 'experience' и 'schedule' — они ушли в баджи шапки
const INFO_CARDS_CONFIG = [
    { key: 'address', label: 'Адрес', icon: '🏠' },
    { key: 'busyType', label: 'Тип занятости', icon: '💼' },
    { key: 'education', label: 'Образование', icon: '🎓' },
] as const;

const CONTACT_CARDS_CONFIG = [
    { key: 'phone', label: 'Телефон', icon: '📱', prefix: 'tel:' },
    { key: 'email', label: 'Email', icon: '✉️', prefix: 'mailto:' },
    { key: 'website', label: 'Сайт', icon: '🌐', prefix: '' },
] as const;

export default function VacancyContent({ vacancy, onScrollTopChange }: VacancyContentProps) {
    const contentRef = useScrollTop(onScrollTopChange);

    if (!vacancy) {
        return (
            <div className={s.content} style={{ color: '#666', padding: '20px', textAlign: 'center' }}>
                Данные вакансии отсутствуют
            </div>
        );
    }

    const hasAnyContact = CONTACT_CARDS_CONFIG.some(config => !!vacancy[config.key]);

    return (
        <div className={s.mainWrapper}>

            {/* 🌟 КОМПАКТНАЯ ФИКСИРОВАННАЯ ШАПКА APPLE-STYLE */}
            <div className={s.stickyHeader}>

                {/* Линия 1: Должность и Дата */}
                <div className={s.headerMainLine}>
                    <h1 className={s.headerProfession}>{vacancy.profession}</h1>
                    {vacancy.date && <span className={s.headerDate}>{vacancy.date}</span>}
                </div>

                {/* Линия 2: Зарплата и Организация */}
                <div className={s.headerSubLine}>
                    <span className={s.headerSalary}>{vacancy.salary}</span>
                    {vacancy.organization && (
                        <>
                            <span className={s.headerDivider}>•</span>
                            <span className={s.headerOrganization}>{vacancy.organization}</span>
                        </>
                    )}
                </div>

                {/* Линия 3: Горизонтальный ряд баджей (Тегов) */}
                {(vacancy.experience || vacancy.schedule) && (
                    <div className={s.headerBadgeRow}>
                        {vacancy.experience && (
                            <div className={s.headerBadge}>
                                📊 Опыт: {vacancy.experience}
                            </div>
                        )}
                        {vacancy.schedule && (
                            <div className={s.headerBadge}>
                                ⏰ {vacancy.schedule}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ВНУТРЕННЯЯ СКРОЛЛ-ЗОНА */}
            <div className={s.content} ref={contentRef}>
                {/* GRID С ОСНОВНОЙ ИНФОРМАЦИЕЙ */}
                <div className={s.infoGrid}>
                    {INFO_CARDS_CONFIG.map(({ key, label, icon }) => {
                        const value = vacancy[key];
                        if (!value) return null;

                        return (
                            <div key={key} className={s.infoCard}>
                                <div className={s.infoIcon}>{icon}</div>
                                <div className={s.infoContent}>
                                    <div className={s.infoLabel}>{label}</div>
                                    <div className={s.infoValue}>{value}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* СЕКЦИЯ КОНТАКТОВ */}
                {hasAnyContact && (
                    <div className={s.contactsSection}>
                        <h3 className={s.sectionTitle}>
                            <span className={s.sectionIcon}>📞</span>
                            Контакты для связи
                        </h3>
                        <div className={s.contactsGrid}>
                            {CONTACT_CARDS_CONFIG.map(({ key, label, icon, prefix }) => {
                                const value = vacancy[key];
                                if (!value) return null;

                                const isExternal = key === 'website';

                                return (
                                    <a
                                        key={key}
                                        href={`${prefix}${value}`}
                                        target={isExternal ? "_blank" : undefined}
                                        rel={isExternal ? "noopener noreferrer" : undefined}
                                        className={s.contactCard}
                                    >
                                        <span className={s.contactIcon}>{icon}</span>
                                        <div className={s.contactInfo}>
                                            <div className={s.contactLabel}>{label}</div>
                                            <div className={s.contactValue}>{value}</div>
                                        </div>
                                        <span className={s.contactArrow}>→</span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ОПИСАНИЕ ВАКАНСИИ */}
                {vacancy.description && (
                    <div className={s.section}>
                        <h3 className={s.sectionTitle}>📝 Описание вакансии</h3>
                        <div className={s.contentBox}>
                            <p className={s.paragraph}>{vacancy.description}</p>
                        </div>
                    </div>
                )}

                {/* ТРЕБОВАНИЯ */}
                {vacancy.requirements && (
                    <div className={s.section}>
                        <h3 className={s.sectionTitle}>⚡ Требования к кандидату</h3>
                        <div className={s.contentBox}>
                            <p className={s.paragraph}>{vacancy.requirements}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* ФИКСИРОВАННЫЙ ПОДВАЛ (ACTION BAR) */}
            <div className={s.actionBottomBar}>
                <a href={`tel:${vacancy.phone}`} className={`${s.actionButton} ${s.phoneButton}`}>
                    📞 Позвонить
                </a>
                {vacancy.website && (
                    <a href={vacancy.website} target="_blank" rel="noopener noreferrer" className={`${s.actionButton} ${s.vkButton}`}>
                        💬 Написать в VK
                    </a>
                )}
            </div>
        </div>
    );
}
