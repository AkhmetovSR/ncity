// app/HomeGridClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Home.module.css';

// Импортируем компоненты модалки и контента
import ModalAnimateWrapper from '@/app/components/ModalAnimateWrapper';
import ModalClientContainer from '@/app/components/ModalClientContainer';
import Vacancy from '@/app/components/Vacancy';
import AboutUs from '@/app/components/AboutUs';
import Contacts from '@/app/components/Contacts';

const COMPONENT_MAP: Record<string, React.ComponentType> = {
    'vacancy': Vacancy,
    'about-us': AboutUs,
    'contacts': Contacts,
};

interface Card {
    id: string;
    path: string;
    title: string;
    desc: string;
}

interface HomeGridClientProps {
    cards: Card[];
    initialActiveId: string; // Начальное состояние, пришедшее с сервера для SEO
}

export default function HomeGridClient({ cards, initialActiveId }: HomeGridClientProps) {
    // 1. Источником правды на клиенте становится локальный стейт, инициализированный сервером
    const [activeId, setActiveId] = useState<string>(initialActiveId);

    // 2. Обработчик клика: открывает модалку и меняет URL за 0 мс (работает без сети)
    const handleCardClick = (path: string) => {
        setActiveId(path);
        // Легализованный в Next.js метод. Меняет URL мгновенно без сетевых запросов
        window.history.pushState(null, '', `/card/${path}`);
    };

    // 3. Синхронизация с системной кнопкой «Назад» в браузере
    useEffect(() => {
        const handlePopState = () => {
            // Проверяем текущий URL. Если мы вернулись на корень, сбрасываем стейт
            const isRoot = window.location.pathname === '/';
            if (isRoot) {
                setActiveId('');
            } else {
                // Если вернулись на другую карточку (из истории), извлекаем её id
                const pathParts = window.location.pathname.split('/');
                const cardId = pathParts[pathParts.length - 1];
                if (COMPONENT_MAP[cardId]) setActiveId(cardId);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const SelectedComponent = COMPONENT_MAP[activeId];

    return (
        <>
            {/* Сетка карточек семантически доступна. Клик перехвачен на JS */}
            <div className={styles.grid}>
                {cards.map((card) => (
                    <div
                        key={card.id}
                        onClick={() => handleCardClick(card.path)}
                        style={{ cursor: 'pointer', textDecoration: 'none' }}
                        role="button"
                        tabIndex={0}
                    >
                        <motion.div
                            layoutId={card.path}
                            className={styles.cardNode}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.45 }}
                        >
                            <div>
                                <h2 className={styles.title}>{card.title}</h2>
                                <p className={styles.desc}>{card.desc}</p>
                            </div>
                            <span className={styles.linkText}>Подробнее →</span>
                        </motion.div>
                    </div>
                ))}
            </div>

            {/*
              Модалка рендерится в едином контексте с карточками.
              Framer Motion безупречно видит layoutId карточки и модалки.
            */}
            <ModalAnimateWrapper>
                {activeId && SelectedComponent && (
                    <ModalClientContainer id={activeId} onClose={() => setActiveId('')}>
                        <SelectedComponent />
                    </ModalClientContainer>
                )}
            </ModalAnimateWrapper>
        </>
    );
}
