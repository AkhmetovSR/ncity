'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { CARD_REGISTRY } from './cards';
import s from './page.module.css';

export default function HomePage() {
    const [activeId, setActiveId] = useState<string | null>(null);
    const cards = Object.values(CARD_REGISTRY);

    // 1. СИНХРОНИЗАЦИЯ URL С БРАУЗЕРОМ
    useEffect(() => {
        if (activeId) {
            // Визуально меняем URL в строке браузера на /card/id, не сбрасывая скролл и контекст
            window.history.pushState(null, '', `/card/${activeId}`);
            document.body.classList.add('no-scroll'); // Блокируем скролл главной
        } else {
            // При закрытии возвращаем URL главной
            window.history.pushState(null, '', '/');
            document.body.classList.remove('no-scroll');
        }
        return () => document.body.classList.remove('no-scroll');
    }, [activeId]);

    // 2. ОБРАБОТКА СИСТЕМНОЙ КНОПКИ "НАЗАД" НА ТЕЛЕФОНЕ ИЛИ СВАЙПА
    useEffect(() => {
        const handlePopState = () => {
            // Если пользователь свайпнул назад на iPhone или нажал кнопку на Android, просто закрываем стейт
            if (window.location.pathname === '/') {
                setActiveId(null);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Отключаем запоминание скролла браузером, чтобы избежать прыжков на мобилках
    useEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }, []);
    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            console.log("🌐 ГЛОБАЛЬНЫЙ КЛИК БРАУЗЕРА по элементу:", e.target);
        };
        window.addEventListener('click', handleGlobalClick);
        return () => window.removeEventListener('click', handleGlobalClick);
    }, []);


    return (
        <div className={s.storeContainer}>
            <main className={s.main}>
                <h1 className={s.pageTitle}>Today</h1>
                <div className={s.grid}>
                    {cards.map((card) => {
                        // Проверяем, открыта ли конкретно ЭТА карточка
                        const isOpen = activeId === card.id;
                        const ContentComponent = card.component;

                        return (
                            // Оборачиваем в Fragment, чтобы сохранять валидную разметку в гриде
                            <section key={card.id}>
                                <Link
                                    href={`/card/${card.id}`}
                                    className={s.cardLink}
                                    onClick={(e) => {
                                        if (e.metaKey || e.ctrlKey || e.button === 1) return;
                                        e.preventDefault();
                                        setActiveId(card.id);
                                    }}
                                >
                                    <motion.div
                                        layoutId={`card-bg-${card.id}`}
                                        className={s.card}
                                        style={{background: card.gradient}}
                                        whileTap={{scale: 0.96}}
                                        transition={{type: 'spring', stiffness: 220, damping: 26}}
                                    >
                                        <motion.span layoutId={`card-tag-${card.id}`} className={s.tag}>
                                            {card.tag}
                                        </motion.span>
                                        <motion.h2 layoutId={`card-title-${card.id}`} className={s.cardTitle}>
                                            {card.title}
                                        </motion.h2>
                                    </motion.div>
                                </Link>

                                {/* Каждая карточка сама управляет своей модалкой */}
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            layoutId={`card-bg-${card.id}`}
                                            className={s.expandedCard}
                                            style={{background: card.gradient}}
                                            transition={{type: 'spring', stiffness: 150, damping: 24}}
                                            onClick={() => setActiveId(null)}
                                        >
                                            <button
                                                className={s.closeButton}
                                                onClick={() => setActiveId(null)}
                                            >
                                                ✕
                                            </button>

                                            <div className={s.contentWrapper}>
                                                <span className={s.tag}>{card.tag}</span>
                                                <h2 className={s.cardTitle}>{card.title}</h2>
                                                <div className={s.bodyText}>
                                                    <ContentComponent/>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </section>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}