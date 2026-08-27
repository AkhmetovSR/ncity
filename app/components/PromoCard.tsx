// app/components/PromoCard.tsx
'use client';

import s from "@/app/components/PromoCard.module.css";
import { motion } from 'framer-motion';

export default function PromoCard() {
    return (
        <motion.div
            layoutId={"promo"}
            className={s.card}
            // className={`${s.cardNode} ${s[card.path] || ''}`}
            whileHover={{scale: 1.01}}
            whileTap={{scale: 0.98}}
            transition={{type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.45}}
        >
            <motion.div layout >Центр детского творчества</motion.div>
        </motion.div>
    );
}
