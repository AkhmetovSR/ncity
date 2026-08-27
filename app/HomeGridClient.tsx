// app/[[...slug]]/HomeGridClient.tsx
'use client';

import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import s from '@/app/HomeGridClient.module.css';


import ModalAnimateWrapper from '@/app/components/ModalAnimateWrapper';
import ModalClientContainer from '@/app/components/ModalClientContainer';
// import Page from '@/app/vacancy/[[...vacancySlug]]/page';
import AboutUs from '@/app/components/AboutUs';
import Contacts from '@/app/components/Contacts';
import Link from "next/link";
import Title from "@/components/Home/Title/Title";
import PromoPage from "@/app/promo/page";
import PromoCard from "@/app/components/PromoCard";

const COMPONENT_MAP: Record<string, React.ComponentType> = {
    'promo': PromoPage,
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

export default function HomeGridClient({cards, initialActiveId}: HomeGridClientProps) {
    const [activeId, setActiveId] = useState<string>(initialActiveId);

    // Обработчик клика по карточке
    const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        setActiveId(path);
        window.history.pushState({type: 'modal'}, '', `/card/${path}`);
    };

    // Синхронизация с системной кнопкой «Назад»
    useEffect(() => {
        // Если при первом заходе с сервера модалка уже открыта,
        // помечаем текущую точку в истории как 'direct-modal'
        if (initialActiveId) {
            window.history.replaceState({type: 'direct-modal'}, '');
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
        <div className={s.Main}>
            <Title/>
            <Link
                href={`/card/promo`}
                onClick={(e) => handleCardClick(e, 'promo')}
                scroll={false}
                className={s.LinkPromo}
                style={{textDecoration: 'none', color: 'inherit'}}
            >
                <PromoCard/>
            </Link>
            <div className={s.grid}>
                {cards.map((card) => (
                    <Link
                        key={card.id}
                        href={`/card/${card.path}`} // Ссылка для роботов-индексаторов (SEO)
                        onClick={(e) => handleCardClick(e, card.path)} // Перехват для живых пользователей
                        scroll={false} // Предотвращаем прыжки экрана
                        className={s.cardLinkWrapper} // Переносим стили (например, display: block)
                        style={{textDecoration: 'none', color: 'inherit'}}
                    >
                        <motion.div
                            layoutId={card.path}
                            className={`${s.cardNode} ${s[card.path] || ''}`}
                            whileHover={{scale: 1.01}}
                            whileTap={{scale: 0.98}}
                            transition={{type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.45}}
                        >
                            <motion.div layout>
                                <h2 className={s.title}>{card.title}</h2>
                                <p className={s.desc}>{card.desc}</p>
                            </motion.div>
                            <motion.span className={s.linkText} layout>Подробнее →</motion.span>
                        </motion.div>
                    </Link>
                ))}
            </div>

            <ModalAnimateWrapper>
                {activeId && SelectedComponent && (
                    <ModalClientContainer
                        key={activeId}
                        id={activeId}
                        onClose={() => setActiveId('')}
                    >
                        <SelectedComponent/>
                    </ModalClientContainer>
                )}
            </ModalAnimateWrapper>
        </div>
    );
}
