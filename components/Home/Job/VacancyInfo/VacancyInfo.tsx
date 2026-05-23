'use client';
import s from './VacancyInfo.module.css';
import { motion, PanInfo } from "framer-motion";
import { JSX, useEffect, useRef, useState } from "react";
import { Vacancy } from "@/types/vacancy";

interface VacancyInfoProps {
    vacancy?: Vacancy;
    onClose?: () => void;
}

export default function VacancyInfo({ vacancy, onClose }: VacancyInfoProps) {
    const [dragY, setDragY] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const isAtTopRef = useRef(true);
    const [asd, setAsd] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!vacancy) return null;

    /**
     * Проверяем, находится ли контент в самом верху
     */
    const checkIfAtTop = () => {
        if (contentRef.current) {
            isAtTopRef.current = contentRef.current.scrollTop === 0;
            // alert("asd")
        }
    };

    /**
     * Обработчик скролла контента
     */
    const handleScroll = () => {
        if (contentRef.current) {
            const atTop = contentRef.current.scrollTop === 0;
            isAtTopRef.current = atTop;

            // Если мы не вверху - блокируем drag
            if (contentRef.current.scrollTop === 0) {
                setAsd(true);
                setDragY(0);
            }
        }
    };

    /**
     * Обработчик начала drag
     */
    const handleDragStart = () => {
        // Запоминаем позицию скролла перед drag
        if (contentRef.current) {
            isAtTopRef.current = contentRef.current.scrollTop === 0;
        }
    };

    /**
     * Обработчик drag
     */
    const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        // Если контент не вверху - не даём тянуть
        if (!isAtTopRef.current && info.offset.y > 0) {
            return;
        }

        // Если тянем вниз и мы вверху - разрешаем
        if (info.offset.y > 0 && isAtTopRef.current) {
            setDragY(info.offset.y);
        }
    };

    /**
     * Обработчик окончания drag
     */
    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        // Если контент не вверху - не закрываем
        if (!isAtTopRef.current) {
            setDragY(0);
            return;
        }

        // Если сдвинули вниз больше чем на 100px ИЛИ скорость > 500
        if (info.offset.y > 100 || info.velocity.y > 500) {
            onClose?.();
        } else {
            // Возвращаем на место
            setDragY(0);
        }
    };

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
        <>
            {/* Затемнённый фон */}
            <motion.div
                className={s.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: dragY > 0 ? 1 - dragY / 500 : 1 }}
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
                onScroll={handleScroll}
                onTouchStart={checkIfAtTop}
                drag="y"                          // ← ВКЛЮЧАЕТ DRAG ПО ВЕРТИКАЛИ
                dragDirectionLock                 // ← БЛОКИРУЕТ ГОРИЗОНТАЛЬНОЕ ПЕРЕТАСКИВАНИЕ
                dragConstraints={{ top: 0 }}      // ← НЕ ДАЁТ ТЯНУТЬ ВВЕРХ (ТОЛЬКО ВНИЗ)
                dragElastic={{ top: 0, bottom: 0.3 }}  // ← УПРУГОСТЬ ПРИ ПЕРЕТЯГИВАНИИ
                onDragEnd={(e, { offset, velocity }) => {  // ← КОГДА ОТПУСТИЛИ
                    if (offset.y > 100 || velocity.y > 500) {
                        onClose?.();  // ← ЗАКРЫВАЕМ ЕСЛИ СДВИНУЛИ >100px ИЛИ СКОРОСТЬ >500
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
                            <div><h2 className={s.title}>{vacancy.profession}</h2></div>
                            <div className={s.divClose}>
                                <button className={s.closeButton} onClick={onClose}>✕</button>
                            </div>
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
                <div

                    className={s.content}

                >
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
        </>
    );
}