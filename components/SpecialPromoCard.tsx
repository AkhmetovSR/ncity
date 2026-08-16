// // components/SpecialPromoCard.tsx
// 'use client'; // Компонент работает в клиентском интерактивном контуре
//
// import React from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link'; // Используем канонический компонент ссылок от Next.js
// import StoreCard from '@/components/StoreCard'; // Наш универсальный распределенный движок модалки
// import Job from "@/components/Home/Job/Job"; // Внутренний контент закрытого виджета ("превью")
// import VacancyList from "@/components/Home/Job/VacancyList/VacancyList"; // Контент открытой модалки (список)
// import s from '@/components/SpecialPromoCard.module.css'; // Твои глобальные стили для слоев модалки
//
// // Описываем пропсы чтения, которые спустил нам родительский компонент Main
// interface SpecialPromoCardProps {
//     activeId: string | null;       // Какая карточка сейчас активна в адресной строке
//     activeVacancyId: string | null; // Какой ID вакансии выбран (для глубокого роутинга)
// }
//
// export function SpecialPromoCard({ activeId, activeVacancyId }: SpecialPromoCardProps) {
//     const id = "vacancy"; // Намертво фиксируем уникальный ID для ДАННОЙ карточки
//
//     // Декларативное условие: шторка открыта, если в URL находится ID именно нашей карточки
//     const isOpen = activeId === id;
//
//     return (
//         <div className={s.VacancyCard}>
//             {/* 🌟 КАНОНИЧЕСКАЯ ССЫЛКА НАВЕГАЦИИ (Вход в шторку): */}
//             {/* При клике Next.js просто меняет текст в адресной строке на /card/vacancy. */}
//             {/* Мы убрали любые onClick и e.preventDefault()! Роутер делает чистый push. */}
//             {/* scroll={false} критично: запрещает главной странице прыгать наверх при смене URL */}
//             <Link
//                 href={`/card/${id}`}
//                 className={s.cardLink}
//                 scroll={false}
//             >
//                 {/* 🌟 ФИЗИКА FLIP: Если карточка ЗАКРЫТА, мы рендерим её базовый motion.div */}
//                 {/* Как только URL изменится на /card/vacancy, этот блок скроется (!isOpen), */}
//                 {/* освобождая layoutId для летящей модалки в StoreCard, и Framer Motion */}
//                 {/* сделает идеальный слепок геометрии в текущем кадре экрана */}
//                 {!isOpen && (
//                     <motion.div
//                         layoutId={`card-bg-${id}`} // Ключевой идентификатор для связи с модалкой
//                         className={s.cardBase} // Твои базовые стили карточки в сетке
//                         // Настраиваем мягкую пружину, которая умеет гасить скорость полёта
//                         // initial={{ opacity: 0, scale: 0.95 }}
//                         // animate={{ opacity: 1, scale: 1 }}
//                         exit={{
//                             opacity: 0,
//                             scale: 0.9,
//                             transition: { duration: 0.25 }
//                         }}
//                         transition={{
//                             type: 'spring',
//                             stiffness: 300,
//                             damping: 30
//                         }}
//                     >
//                         {/* Рендерим внутреннее превью (маленький виджет Job) */}
//                         <div className={s.widgetVisible}>
//                             <Job />
//                         </div>
//                     </motion.div>
//                 )}
//             </Link>
//
//             {/* 🌟 ТВОЙ РОДНОЙ РАСПРЕДЕЛЕННЫЙ ДВИЖОК: */}
//             {/* StoreCard сидит на своем законном месте снаружи ссылки. */}
//             {/* Он получает свой id и текущий activeId из URL. Как только они совпадут, */}
//             {/* он проснется и плавно взлетит, подхватив layoutId="card-bg-vacancy". */}
//             <StoreCard id={id} activeId={activeId}>
//                 {/* Внутрь прокидываем контент списка вакансий, который мы пока условно закомментировали */}
//                 <VacancyList />
//             </StoreCard>
//         </div>
//     );
// }

// components/SpecialPromoCard.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import StoreCard from '@/components/StoreCard';
import Job from "@/components/Home/Job/Job";
import VacancyList from "@/components/Home/Job/VacancyList/VacancyList";
import s from '@/components/SpecialPromoCard.module.css';

export function SpecialPromoCard() {
    const id = "vacancy";

    return (
        <div className={s.VacancyCard}>
            <Link
                href={`/card/${id}`}
                className={s.cardLink}
                scroll={false}
            >
                <motion.div
                    layoutId={`card-bg-${id}`}
                    className={s.cardBase}
                    transition={{ type: 'spring', stiffness: 200, damping: 24, mass: 1.1 }}
                >
                    <div className={s.widgetVisible}>
                        <Job />
                    </div>
                </motion.div>
            </Link>

            <StoreCard id={id}>
                <VacancyList />
            </StoreCard>
        </div>
    );
}

// // components/SpecialPromoCard.tsx
// 'use client';
//
// import React from 'react';
// import { motion } from 'framer-motion';
// import { useRouter } from 'next/navigation'; // ← Добавляем useRouter
// import Link from 'next/link';
// import StoreCard from '@/components/StoreCard';
// import Job from "@/components/Home/Job/Job";
// import VacancyList from "@/components/Home/Job/VacancyList/VacancyList";
// import s from '@/components/SpecialPromoCard.module.css';
//
// interface SpecialPromoCardProps {
//     activeId: string | null;
//     activeVacancyId: string | null;
// }
//
// export function SpecialPromoCard({ activeId, activeVacancyId }: SpecialPromoCardProps) {
//     const router = useRouter();
//     const id = "vacancy";
//     const isOpen = activeId === id;
//
//     /**
//      * 🔥 ФИКС: Используем replace вместо Link для открытия
//      *
//      * Проблема: Link использует push, который добавляет запись в историю.
//      * При множественных открытиях/закрытиях история засоряется.
//      *
//      * Решение: Используем router.replace(), который ЗАМЕНЯЕТ текущую запись
//      * в истории, а не добавляет новую.
//      *
//      * Теперь при открытии модалки:
//      * - Если мы на главной (/), то / заменяется на /card/vacancy
//      * - При закрытии через replace на /, запись /card/vacancy заменяется на /
//      *
//      * В итоге в истории остается только одна запись: /
//      */
//     const handleOpen = () => {
//         router.replace(`/card/${id}`);
//     };
//
//     /**
//      * 🚪 ОБРАБОТЧИК ЗАКРЫТИЯ из StoreCard
//      * Передаем его в StoreCard через пропс onClose
//      */
//     const handleClose = () => {
//         router.replace('/');
//     };
//
//     return (
//         <div className={s.VacancyCard}>
//             {!isOpen && (
//                 <motion.div
//                     layoutId={`card-bg-${id}`}
//                     className={s.cardBase}
//                     transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//                     onClick={handleOpen} // ← Открываем через replace
//                 >
//                     <div className={s.widgetVisible}>
//                         <Job />
//                     </div>
//                 </motion.div>
//             )}
//
//             <StoreCard
//                 id={id}
//                 activeId={activeId}
//                 onClose={handleClose} // ← Передаем обработчик
//             >
//                 <VacancyList />
//             </StoreCard>
//         </div>
//     );
// }