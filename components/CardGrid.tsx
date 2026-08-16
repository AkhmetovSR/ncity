// components/CardGrid.tsx
'use client'; // Директива клиентского контура для работы motion.div в итерациях

import React from 'react';
import Link from 'next/link'; // Используем канонический Link от Next.js [INDEX]
import { motion } from 'framer-motion';
import StoreCard from '@/components/StoreCard'; // 🌟 Подключаем наш универсальный движок модалки [INDEX]
import s from '@/components/CardGrid.module.css'; // Твои оригинальные стили 3-колоночной сетки

// Описываем форму структуры одной карточки портала
interface CardItem {
    id: string; // Уникальный строковый ID (например, "travel", "coding", "A", "B")
    widget: React.ComponentType<{ isOpen: boolean }>; // Компонент маленького превью-виджета
}

// Описываем пропсы, которые CardGrid получает сверху от презентационного ядра Main
interface CardGridProps {
    cards: CardItem[];       // Массив карточек, который мы будем мапить
    activeId: string | null; // Текущий активный ID карточки, пришедший из URL [INDEX]
}

export function CardGrid({ cards, activeId }: CardGridProps) {
    return (
        /* Рендерим твой оригинальный 3-колоночный контейнер сетки */
        <div className={s.grid}>
            {cards.map((card) => {
                const WidgetComponent = card.widget;

                // Декларативное условие: конкретно эта ячейка сетки сейчас открыта в URL? [INDEX]
                const isOpen = activeId === card.id;

                return (
                    /* Оболочка ячейки сетки, удерживающая физическое место в гриде */
                    <div key={card.id} className={s.cardWrapper}>

                        {/* 🌟 КАНОНИЧЕСКАЯ ССЫЛКА НАВЕДЕНИЯ ФОКУСА (Вход в карточку): */}
                        {/* При клике Next.js просто пушит в адресную строку новый ЧПУ-путь: /card/[id]. */}
                        {/* Мы убрали любые onClick и e.preventDefault()! Никаких грязных хаков [INDEX]. */}
                        {/* scroll={false} критично: запрещает главной странице сбрасывать скролл при клике. */}
                        <Link
                            href={`/card/${card.id}`}
                            className={s.cardLink}
                            scroll={false}
                        >
                            {/* 🌟 ФИЗИКА ПАРАЛЛЕЛЬНОГО ПЕРЕКЛИКА: */}
                            {/* Мы рендерим и анимируем маленькую закрытую плитку ТОЛЬКО когда фокус не на ней (!isOpen). */}
                            {/* Как только пользователь кликает, URL меняется, isOpen становится true, */}
                            {/* и эта маленькая плитка тихо исчезает из DOM, отдавая свой layoutId */}
                            {/* взлетающей локальной модалке StoreCard, которая сидит прямо под ней [INDEX]. */}
                            {!isOpen && (
                                <motion.div
                                    layoutId={`card-bg-${card.id}`} // Уникальный layoutId для каждой карты в сетке [INDEX]
                                    className={s.cardBase} // Твои оригинальные стили со скруглением 16px
                                    // Синхронизируем пружину анимации с промо-карточкой, чтобы скорость полёта везде была одинаковой
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                >
                                    {/* Рендерим внутренний контент маленького виджета (isOpen={false}) */}
                                    <div className={s.widgetVisible}>
                                        <WidgetComponent isOpen={false} />
                                    </div>
                                </motion.div>
                            )}
                        </Link>

                        {/* 🌟 ТВОЙ РОДНОЙ ИЗОЛИРОВАННЫЙ ДВИЖОК МОДАЛКИ: */}
                        {/* Мы вернули StoreCard внутрь итерации каждой карточки в сетке [INDEX]! */}
                        {/* За счет этого у каждой из 1000 карточек появляется свой персональный анимационный поток [INDEX]. */}
                        {/* Сюда ты декларативно подсовываешь тот же WidgetComponent, но уже в режиме isOpen={true}. */}
                        <StoreCard id={card.id} activeId={activeId}>
                            <WidgetComponent isOpen={true} />
                        </StoreCard>
                    </div>
                );
            })}
        </div>
    );
}
