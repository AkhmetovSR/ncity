'use client';
import s from './VacancyInfo.module.css';
import { motion, AnimatePresence } from "framer-motion";
import { JSX, useEffect, useState } from "react";
import { Vacancy } from "@/types/vacancy";
import Link from "next/link";

interface VacancyInfoProps {
    vacancy?: Vacancy;
    onClose?: () => void;
}

export default function VacancyInfo({ vacancy, onClose }: VacancyInfoProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Небольшая задержка для плавного появления
        setTimeout(() => setIsVisible(true), 50);
        return () => setIsVisible(false);
    }, []);

    if (!vacancy) return null;

    /**
     * Парсит HTML в структурированный текст с поддержкой различных тегов
     * @param html - HTML строка для парсинга
     * @returns массив JSX элементов
     */
    const parseHtmlToStructuredText = (html: string): JSX.Element[] => {
        if (!html) return [];

        const elements: JSX.Element[] = [];
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const body = doc.body;
        let keyCounter = 0;

        const processNode = (node: Node, isInsideList: boolean = false) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent?.trim();
                if (text && !isInsideList) {
                    elements.push(
                        <p key={keyCounter++} className={s.paragraph}>
                            {text}
                        </p>
                    );
                }
                return;
            }

            if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                const tagName = element.tagName.toLowerCase();

                switch (tagName) {
                    case 'p':
                        const pText = element.textContent?.trim();
                        if (pText) {
                            const hasBold = element.querySelector('b, strong');
                            if (hasBold && pText.length < 100) {
                                elements.push(
                                    <h4 key={keyCounter++} className={s.subHeader}>
                                        {pText}
                                    </h4>
                                );
                            } else {
                                elements.push(
                                    <p key={keyCounter++} className={s.paragraph}>
                                        {pText}
                                    </p>
                                );
                            }
                        }
                        break;

                    case 'b':
                    case 'strong':
                        const boldText = element.textContent?.trim();
                        if (boldText && boldText.length < 80) {
                            elements.push(
                                <h4 key={keyCounter++} className={s.subHeader}>
                                    {boldText}
                                </h4>
                            );
                        }
                        break;

                    case 'ul':
                    case 'ol':
                        const listItems: JSX.Element[] = [];
                        element.querySelectorAll('li').forEach((li, idx) => {
                            const liText = li.textContent?.trim();
                            if (liText) {
                                listItems.push(
                                    <li key={idx} className={s.listItem}>
                                        {liText}
                                    </li>
                                );
                            }
                        });
                        if (listItems.length > 0) {
                            elements.push(
                                <ul key={keyCounter++} className={s.list}>
                                    {listItems}
                                </ul>
                            );
                        }
                        break;

                    case 'br':
                        elements.push(<div key={keyCounter++} className={s.spacer} />);
                        break;

                    default:
                        element.childNodes.forEach(child => processNode(child, isInsideList));
                        break;
                }
            }
        };

        body.childNodes.forEach(node => processNode(node));
        return elements;
    };

    return (
        <AnimatePresence>
            {/* Затемнённый фон с анимацией */}
            <motion.div
                className={s.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: isVisible ? 1 : 0 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                transition={{ duration: 0.2 }}
            />

            {/* Панель с информацией - выезжает снизу */}
            <motion.div
                className={s.vacancyInfo}
                initial={{ y: '100%' }}
                animate={{ y: isVisible ? 0 : '100%' }}
                exit={{ y: '100%' }}
                transition={{
                    type: 'spring',
                    damping: 30,
                    stiffness: 300,
                    mass: 0.8
                }}
            >
                {/* Индикатор свайпа (для мобильных) */}
                <div className={s.swipeIndicator}>
                    <div className={s.swipeBar} />
                </div>

                <div className={s.header}>
                    <div className={s.headerContent}>
                        <h2 className={s.title}>{vacancy.profession}</h2>
                        <motion.button
                            className={s.closeButton}
                            onClick={onClose}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            ✕
                        </motion.button>
                    </div>
                </div>

                <div className={s.content}>
                    {/* Зарплата - акцентный блок */}
                    {vacancy.salary && (
                        <motion.div
                            className={s.salaryBox}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <span className={s.salaryIcon}>💰</span>
                            <span className={s.salaryValue}>{vacancy.salary}</span>
                        </motion.div>
                    )}

                    {/* Основная информация в виде карточек */}
                    <motion.div
                        className={s.infoGrid}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                    >
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

                        {vacancy.date && (
                            <div className={s.infoCard}>
                                <div className={s.infoIcon}>📅</div>
                                <div className={s.infoContent}>
                                    <div className={s.infoLabel}>Дата публикации</div>
                                    <div className={s.infoValue}>{vacancy.date}</div>
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

                    {/* Контакты */}
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

                    {/* Описание вакансии */}
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
                            <div className={s.contentBox}>
                                {parseHtmlToStructuredText(vacancy.description)}
                            </div>
                        </motion.div>
                    )}

                    {/* Требования */}
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
                            <div className={s.contentBox}>
                                {parseHtmlToStructuredText(vacancy.requirements)}
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}