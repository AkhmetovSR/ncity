'use client';
import s from '@/components/Home/Job/VacancyInfo/VacancyContent/VacancyContent.module.css';
import { useEffect, useRef, useState } from "react";
import { Vacancy } from "@/types/vacancy";
import {JSX} from "react";

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

    // Функция для парсинга HTML в структурированный текст
    const parseHtmlToStructuredText = (html: string): JSX.Element[] => {
        if (!html) return [];

        const elements: JSX.Element[] = [];

        // Создаем временный DOM элемент для парсинга HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const body = doc.body;

        let keyCounter = 0;

        // Рекурсивная функция для обхода узлов
        const processNode = (node: Node, parentList: boolean = false) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent?.trim();
                if (text && !parentList) {
                    elements.push(<p key={keyCounter++} className={s.paragraph}>{text}</p>);
                }
                return;
            }

            if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                const tagName = element.tagName.toLowerCase();

                switch (tagName) {
                    case 'p':
                        // Параграф
                        const pText = element.textContent?.trim();
                        if (pText) {
                            // Проверяем, является ли параграф заголовком (содержит <b> или <strong>)
                            const hasBold = element.querySelector('b, strong');
                            if (hasBold) {
                                elements.push(<h4 key={keyCounter++} className={s.subHeader}>{pText}</h4>);
                            } else {
                                elements.push(<p key={keyCounter++} className={s.paragraph}>{pText}</p>);
                            }
                        }
                        break;

                    case 'b':
                    case 'strong':
                        // Жирный текст как подзаголовок
                        const boldText = element.textContent?.trim();
                        if (boldText) {
                            elements.push(<h4 key={keyCounter++} className={s.subHeader}>{boldText}</h4>);
                        }
                        break;

                    case 'ul':
                    case 'ol':
                        // Список
                        const listItems: JSX.Element[] = [];
                        element.querySelectorAll('li').forEach((li, idx) => {
                            const liText = li.textContent?.trim();
                            if (liText) {
                                listItems.push(<li key={idx}>{liText}</li>);
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
                        // Перенос строки
                        elements.push(<div key={keyCounter++} className={s.spacer} />);
                        break;

                    default:
                        // Рекурсивно обрабатываем дочерние узлы
                        element.childNodes.forEach(child => processNode(child, parentList));
                        break;
                }
            }
        };

        body.childNodes.forEach(node => processNode(node));

        return elements;
    };

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

            {/* Описание вакансии */}
            {vacancy?.description && (
                <div className={s.section}>
                    <h3 className={s.sectionTitle}>📝 Описание вакансии</h3>
                    <div className={s.contentBox}>
                        {parseHtmlToStructuredText(vacancy.description)}
                    </div>
                </div>
            )}

            {/* Требования */}
            {vacancy?.requirements && (
                <div className={s.section}>
                    <h3 className={s.sectionTitle}>⚡ Требования к кандидату</h3>
                    <div className={s.contentBox}>
                        {parseHtmlToStructuredText(vacancy.requirements)}
                    </div>
                </div>
            )}
        </div>
    );
}