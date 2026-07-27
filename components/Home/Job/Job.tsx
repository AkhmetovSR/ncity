'use client';

import React from "react";
import { motion } from "framer-motion";
// import { useModal } from "@/context/ModalContext";
import s from "@/components/Home/Job/Job.module.css";
import { Link } from 'next-view-transitions';

export default function Job() {
    const cardId = "vacancy"; // Уникальный ID для связи с модалкой
    // const { openModal } = useModal(); // Достаем функцию открытия из контекста
    //
    // const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    //     e.preventDefault(); // Полностью блокируем переход браузера по ссылке
    //
    //     // 1. Мгновенно запускаем локальную анимацию расширения карточки
    //     openModal(cardId);
    //
    //     // 2. Красиво меняем URL в строке браузера без перезагрузки страницы и без участия роутера Next.js
    //     window.history.pushState(null, "", `/view/${cardId}`);
    // };

    return (
        /*
          Заменили <Link> на обычный тег <a>.
          Роботы SEO видят чистый href="/view/vacancy" и идеально индексируют страницу.
          А Next.js больше не может сломать анимацию своим скрытым фоновым префетчем!
        */

        <motion.div
            className={s.VacancyCard}
            layoutId={cardId} // Связующий ID для Framer Motion
            transition={{type: "spring", stiffness: 220, damping: 26}} // iOS-пружина
            whileHover={{scale: 1.015}}
            whileTap={{scale: 0.985}}
        >
            {/*<a href={`/view/${cardId}`} onClick={handleClick} className={s.Link}>*/}
                <motion.div layout="position" className={s.placeholderContent}>
                    <h3></h3>
                    <Link href={`/view/vacancy`} >
                        <div>открыть</div>
                    </Link>
                </motion.div>
            {/*</a>*/}
        </motion.div>

)
    ;
}
