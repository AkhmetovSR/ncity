'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CARD_REGISTRY } from '@/app/cards';
import s from './page.module.css';

export default function HomePage() {
    const cards = Object.values(CARD_REGISTRY);

    return (
        <main className={s.main}>
            <h1 className={s.pageTitle}>Today</h1>
            <div className={s.grid}>
                {cards.map((card) => (
                    <Link key={card.id} href={`/card/${card.id}`} className={s.cardLink} scroll={false}>
                        <motion.div
                            layoutId={`card-bg-${card.id}`}
                            className={s.card}
                            style={{ background: card.gradient }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
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
    );
}
