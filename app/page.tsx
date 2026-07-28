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

    return (
        <div className={s.storeContainer}>
            <main className={s.main}>
                <h1 className={s.pageTitle}>Today</h1>
                <div className={s.grid}>
                    {cards.map((card) => (
                        <Link
                            key={card.id}
                            href={`/card/${card.id}`}
                            className={s.cardLink}
                            onClick={(e) => {
                                // Если зажат Ctrl/Cmd или кликнули колесиком на ПК — открываем в новой вкладке (SEO-стандарт)
                                if (e.metaKey || e.ctrlKey || e.button === 1) return;

                                e.preventDefault(); // Запрещаем роутеру делать Hard-переход на мобилках!
                                setActiveId(card.id); // Запускаем синхронную пружину
                            }}
                        >
                            <motion.div
                                layoutId={`card-bg-${card.id}`}
                                className={s.card}
                                style={{ background: card.gradient }}
                                whileTap={{ scale: 0.96 }} // iOS микро-сжатие при тапе
                                transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                            >
                                <motion.span layoutId={`card-tag-${card.id}`} className={s.tag}>
                                    {card.tag}
                                </motion.span>
                                <motion.h2 layoutId={`card-title-${card.id}`} className={s.cardTitle}>
                                    {card.title}
                                </motion.h2>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </main>

            {/* УНИВЕРСАЛЬНОЕ ОКНО (Рендерится в одном контексте с главной) */}
            <AnimatePresence>
                {activeId && (() => {
                    const card = CARD_REGISTRY[activeId];
                    if (!card) return null;
                    const ContentComponent = card.component;

                    return (
                        <>
                            {/* Размытый оверлей */}
                            <motion.div
                                className={s.overlay}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setActiveId(null)}
                            />

                            {/* Раскрывающееся окно */}
                            <motion.div
                                layoutId={`card-bg-${activeId}`}
                                className={s.expandedCard}
                                style={{ background: card.gradient }}
                                transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                            >
                                <button className={s.closeButton} onClick={() => setActiveId(null)}>✕</button>

                                <div className={s.contentWrapper}>
                                    <motion.span layoutId={`card-tag-${activeId}`} className={s.tag}>
                                        {card.tag}
                                    </motion.span>
                                    <motion.h2 layoutId={`card-title-${activeId}`} className={s.cardTitle}>
                                        {card.title}
                                    </motion.h2>

                                    {/* Текст плавно проявляется, чтобы строки не плыли при расширении */}
                                    <motion.div
                                        className={s.bodyText}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: 0.15, duration: 0.25 }}
                                    >
                                        <ContentComponent />
                                    </motion.div>
                                </div>
                            </motion.div>
                        </>
                    );
                })()}
            </AnimatePresence>
        </div>
    );
}
