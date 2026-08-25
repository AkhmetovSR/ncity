// // app/HomeGridClient.tsx
// 'use client';
//
// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import styles from './Home.module.css';
//
// // Импортируем компоненты модалки и контента
// import ModalAnimateWrapper from '@/app/components/ModalAnimateWrapper';
// import ModalClientContainer from '@/app/components/ModalClientContainer';
// import Page from '@/app/components/Page';
// import AboutUs from '@/app/components/AboutUs';
// import Contacts from '@/app/components/Contacts';
//
// const COMPONENT_MAP: Record<string, React.ComponentType> = {
//     'vacancy': Page,
//     'about-us': AboutUs,
//     'contacts': Contacts,
// };
//
// interface Card {
//     id: string;
//     path: string;
//     title: string;
//     desc: string;
// }
//
// interface HomeGridClientProps {
//     cards: Card[];
//     initialActiveId: string; // Начальное состояние, пришедшее с сервера для SEO
// }
//
// export default function HomeGridClient({ cards, initialActiveId }: HomeGridClientProps) {
//     // 1. Источником правды на клиенте становится локальный стейт, инициализированный сервером
//     const [activeId, setActiveId] = useState<string>(initialActiveId);
//
//     // 2. Обработчик клика: открывает модалку и меняет URL за 0 мс (работает без сети)
//     const handleCardClick = (path: string) => {
//         // Используем функциональный апдейт. React гарантирует,
//         // что мы берем самое актуальное состояние из памяти прямо СЕЙЧАС,
//         // полностью игнорируя незавершенные очереди предыдущих рендеров.
//         setActiveId((prev) => {
//             // Если вдруг клик произошел в микросекунду закрытия,
//             // мы жестко стираем старое и ставим новое
//             return path;
//         });
//
//         // Нативно меняем URL. Браузер обновляет строку синхронно с новым ID
//         window.history.pushState(null, '', `/card/${path}`);
//     };
//
//     // // 3. Синхронизация с системной кнопкой «Назад» в браузере
//     // useEffect(() => {
//     //     const handlePopState = () => {
//     //         // Проверяем текущий URL. Если мы вернулись на корень, сбрасываем стейт
//     //         const isRoot = window.location.pathname === '/';
//     //         if (isRoot) {
//     //             setActiveId('');
//     //         } else {
//     //             // Если вернулись на другую карточку (из истории), извлекаем её id
//     //             const pathParts = window.location.pathname.split('/');
//     //             const cardId = pathParts[pathParts.length - 1];
//     //             if (COMPONENT_MAP[cardId]) setActiveId(cardId);
//     //         }
//     //     };
//     //
//     //     window.addEventListener('popstate', handlePopState);
//     //     return () => window.removeEventListener('popstate', handlePopState);
//     // }, []);
//     // 3. Синхронизация с системной кнопкой «Назад» в браузере
//     useEffect(() => {
//         // ЕСЛИ зашли по прямой ссылке (initialActiveId не пустой),
//         // вешаем на текущую страницу истории метку прямого захода
//         if (initialActiveId) {
//             window.history.replaceState({ isDirectEntry: true }, '');
//         }
//
//         const handlePopState = () => {
//             const isRoot = window.location.pathname === '/';
//             if (isRoot) {
//                 setActiveId('');
//             } else {
//                 const pathParts = window.location.pathname.split('/');
//                 const cardId = pathParts[pathParts.length - 1];
//                 if (COMPONENT_MAP[cardId]) setActiveId(cardId);
//             }
//         };
//
//         window.addEventListener('popstate', handlePopState);
//         return () => window.removeEventListener('popstate', handlePopState);
//     }, [initialActiveId]); // Добавили initialActiveId в зависимости для безопасности
//
//
//     const SelectedComponent = COMPONENT_MAP[activeId];
//
//     return (
//         <>
//             {/* Сетка карточек семантически доступна. Клик перехвачен на JS */}
//             <div className={styles.grid}>
//                 {cards.map((card) => (
//                     <div
//                         key={card.id}
//                         onClick={() => handleCardClick(card.path)}
//                         style={{ cursor: 'pointer', textDecoration: 'none' }}
//                         role="button"
//                         tabIndex={0}
//                     >
//                         <motion.div
//                             layoutId={card.path}
//                             className={styles.cardNode}
//                             whileHover={{ scale: 1.01 }}
//                             whileTap={{ scale: 0.98 }}
//                             transition={{ type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.45 }}
//                         >
//                             <div>
//                                 <h2 className={styles.title}>{card.title}</h2>
//                                 <p className={styles.desc}>{card.desc}</p>
//                             </div>
//                             <span className={styles.linkText}>Подробнее →</span>
//                         </motion.div>
//                     </div>
//                 ))}
//             </div>
//
//             {/*
//               Модалка рендерится в едином контексте с карточками.
//               Framer Motion безупречно видит layoutId карточки и модалки.
//             */}
//             <ModalAnimateWrapper>
//                 {activeId && SelectedComponent && (
//                     <ModalClientContainer
//                         key={activeId} // КРИТИЧЕСКИ ВАЖНО: принудительно разделяет контексты анимации
//                         id={activeId}
//                         onClose={() => setActiveId('')}
//                     >
//                         <SelectedComponent />
//                     </ModalClientContainer>
//                 )}
//             </ModalAnimateWrapper>
//         </>
//     );
// }

// app/[[...slug]]/HomeGridClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import s from '@/app/HomeGridClient.module.css';


import ModalAnimateWrapper from '@/app/components/ModalAnimateWrapper';
import ModalClientContainer from '@/app/components/ModalClientContainer';
import Page from '@/app/vacancy/page';
import AboutUs from '@/app/components/AboutUs';
import Contacts from '@/app/components/Contacts';

const COMPONENT_MAP: Record<string, React.ComponentType> = {
    'vacancy': Page,
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
    initialActiveId: string;
}

export default function HomeGridClient({ cards, initialActiveId }: HomeGridClientProps) {
    const [activeId, setActiveId] = useState<string>(initialActiveId);

    // Обработчик клика по карточке
    const handleCardClick = (path: string) => {
        setActiveId(path);

        // КАНОН NEXT.JS: Используем официальное HTML5 History API.
        // Первым аргументом передаем объект состояния с типом 'modal'.
        // Это наш маркер, который убережет DoubleExitHandler от ложных срабатываний.
        window.history.pushState({ type: 'modal' }, '', `/card/${path}`);
    };

    // Синхронизация с системной кнопкой «Назад»
    useEffect(() => {
        // Если при первом заходе с сервера модалка уже открыта,
        // помечаем текущую точку в истории как 'direct-modal'
        if (initialActiveId) {
            window.history.replaceState({ type: 'direct-modal' }, '');
        }

        const handlePopState = () => {
            const isRoot = window.location.pathname === '/';
            if (isRoot) {
                setActiveId('');
            } else {
                const pathParts = window.location.pathname.split('/');
                const cardId = pathParts[pathParts.length - 1];
                if (COMPONENT_MAP[cardId]) setActiveId(cardId);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [initialActiveId]);

    const SelectedComponent = COMPONENT_MAP[activeId];

    return (
        <>
            <div className={s.grid}>
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
                            className={`${s.cardNode} ${s[card.path] || ''}`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.45 }}
                        >
                            <div>
                                <h2 className={s.title}>{card.title}</h2>
                                <p className={s.desc}>{card.desc}</p>
                            </div>
                            <span className={s.linkText}>Подробнее →</span>
                        </motion.div>
                    </div>
                ))}
            </div>

            <ModalAnimateWrapper>
                {activeId && SelectedComponent && (
                    <ModalClientContainer
                        key={activeId}
                        id={activeId}
                        onClose={() => setActiveId('')}
                    >
                        <SelectedComponent />
                    </ModalClientContainer>
                )}
            </ModalAnimateWrapper>
        </>
    );
}
