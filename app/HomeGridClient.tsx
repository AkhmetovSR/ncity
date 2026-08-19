'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Home.module.css'; // Импорт CSS-модуля

interface Card {
    id: string;
    path: string;
    title: string;
    desc: string;
}

interface HomeGridClientProps {
    cards: Card[];
}

export default function HomeGridClient({ cards }: HomeGridClientProps) {
    return (
        <div className={styles.grid}>
            {cards.map((card) => (
                <Link key={card.id} href={`/card/${card.path}`} scroll={false} style={{ textDecoration: 'none' }} prefetch={true}>
                    <motion.div
                        layoutId={card.path}
                        className={styles.cardNode}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        /* Transition должен строго совпадать с модалкой для бесшовного полета */
                        transition={{
                            type: 'tween',
                            ease: [0.25, 1, 0.5, 1],
                            duration: 0.45
                        }}
                    >
                        <div>
                            <h2 className={styles.title}>{card.title}</h2>
                            <p className={styles.desc}>{card.desc}</p>
                        </div>
                        <span className={styles.linkText}>Подробнее →</span>
                    </motion.div>
                </Link>
            ))}
        </div>
    );
}
