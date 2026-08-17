// // components/StoreCard.tsx
// 'use client'; // Директива клиентского контура для работы AnimatePresence и motion.div
//
// import { motion, AnimatePresence } from 'framer-motion';
// import Link from 'next/link'; // 🌟 ИМПОРТИРУЕМ КАНОНИЧЕСКИЙ ЛИНК: Главный элемент канонического закрытия [INDEX]
// import s from '@/components/StoreCard.module.css';
// import { useRouter } from 'next/navigation';
//
// // Описываем пропсы, которые принимает наш универсальный движок шторки
// interface StoreCardProps {
//     id: string;              // Уникальный ID карточки, к которой привязан этот движок (например, "vacancy")
//     activeId: string | null; // Текущий активный ID, пришедший из URL через хук синхронизации [INDEX]
//     children?: React.ReactNode; // Сюда декларативно подсовывается абсолютно любой контент модалки [INDEX]
// }
//
// export default function StoreCard({ id, activeId, children }: StoreCardProps) {
//     const router = useRouter();
//     // 🌟 ДЕКЛАРАТИВНОЕ УСЛОВИЕ ОТКРЫТИЯ:
//     // Модалка открывается ТОЛЬКО в том случае, если ID этой карточки совпал с ID в адресной строке [INDEX]
//     const isOpen = activeId === id;
//
//     return (
//         /*
//            🌟 КАТАЛИЗАТОР ОБРАТНОЙ АНИМАЦИИ (AnimatePresence):
//            Этот компонент от Framer Motion следит за своим содержимым.
//            Как только isOpen становится false (например, при клике на крестик), AnimatePresence
//            НЕ ДАЕТ React мгновенно удалить узел из DOM. Он замораживает его на экране и заставляет
//            выполнить плавную анимацию закрытия (схлопывание в сетку) до самого последнего кадра! [INDEX]
//         */
//         <AnimatePresence>
//             {isOpen && (
//                 /* Внешний фиксированный контейнер, который растянут на весь экран, */
//                 /* но благодаря pointer-events: none из CSS полностью пропускает клики на задний план */
//                 <motion.div className={s.expandedCard}
//                             layoutId={`card-bg-${id}`} // Должен строго совпадать с layoutId закрытой карты! [INDEX]
//                             // className={s.contentWrapper} // Твоя аккуратная карточка по центру экрана
//
//                     // 🌟 СЕНЬОР-ЗАЩИТА ОТ МИГАНИЯ КОНТЕНТА (exit):
//                     // При закрытии мы плавно гасим прозрачность (opacity) внутреннего содержимого,
//                     // чтобы текст и кнопки вакансий красиво растворялись, пока внешняя коробка
//                     // карточки сжимается и летит обратно в свою ячейку сетки.
//                             exit={{ opacity: 0 }}
//
//                     // Настраиваем физическую пружину. stiffness (жесткость) и damping (затухание)
//                     // подобраны так, чтобы полёт был упругим, без резких отскоков и желеобразного дёргания.
//                             transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//                 >
//
//                         <button
//                             className={s.closeButton}
//                             onClick={() => router.back()}
//                         >
//                             ✕
//                         </button>
//
//                         {/* Изолированный контейнер с внутренним инерционным скроллом для твоего кастомного контента */}
//                         <div className={s.innerScrollableContent}>
//                         {children}
//                         </div>
//                     {/*</motion.div>*/}
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );
// }

// // components/StoreCard.tsx
// 'use client';
//
// import { motion, AnimatePresence } from 'framer-motion';
// import { useRouter } from 'next/navigation';
// import s from '@/components/StoreCard.module.css';
//
// // 🔥 ДОБАВЛЯЕМ ОПИСАНИЕ ПРОПСОВ
// interface StoreCardProps {
//     id: string;
//     activeId: string | null;
//     children?: React.ReactNode;
// }
//
// export default function StoreCard({ id, activeId, children }: StoreCardProps) {
//     const router = useRouter();
//     const isOpen = activeId === id;
//
//     const handleClose = () => {
//         if (window.history.length > 1) {
//             router.back();
//         } else {
//             router.push('/');
//         }
//     };
//
//     return (
//         <AnimatePresence mode="wait">
//             {isOpen && (
//                 <motion.div
//                     layoutId={`card-bg-${id}`}
//                     className={s.expandedCard}
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{
//                         opacity: 0,
//                         scale: 0.9,
//                         transition: { duration: 0.25 }
//                     }}
//                     transition={{
//                         type: 'spring',
//                         stiffness: 300,
//                         damping: 30
//                     }}
//                 >
//                     <button
//                         className={s.closeButton}
//                         onClick={handleClose}
//                     >
//                         ✕
//                     </button>
//                     <div className={s.innerScrollableContent}>
//                         {children}
//                     </div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );
// }

// components/StoreCard.tsx
// 'use client';
//
// import { motion, AnimatePresence } from 'framer-motion';
// import s from '@/components/StoreCard.module.css';
// import Link from "next/link";
// import {usePathname, useRouter} from "next/navigation";
// import {useEffect} from "react";
//
// interface StoreCardProps {
//     id: string;
//     activeId: string | null;
//     children?: React.ReactNode;
//     onClose?: () => void; // ← Добавляем колбэк
// }
//
// export default function StoreCard({ id, activeId, children, onClose }: StoreCardProps) {
//     const router = useRouter();
//     const pathname = usePathname();
//     const isOpen = activeId === id;
//     useEffect(() => {
//         // Если модалка открыта, но мы не на /card/:id
//         if (isOpen && !pathname.includes(`/card/${id}`)) {
//             // Закрываем модалку
//             router.back();
//         }
//     }, [pathname, isOpen, id, router]);
//
//     const handleClose = () => {
//         router.replace('/');
//         document.body.style.overflow = '';
//     };
//
//     return (
//         <AnimatePresence mode="wait">
//             {isOpen && (
//                 <motion.div
//                     layoutId={`card-bg-${id}`}
//                     className={s.expandedCard}
//                     initial={{opacity: 0, scale: 0.95}}
//                     animate={{opacity: 1, scale: 1}}
//                     exit={{opacity: 0, scale: 0.9}}
//                     transition={{type: 'spring', stiffness: 300, damping: 30}}
//                 >
//                     <button
//                         className={s.closeButton}
//                         onClick={handleClose}
//                     >
//                         ✕
//                     </button>
//                     <div className={s.innerScrollableContent}>
//                         {children}
//                     </div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );
// }

// components/StoreCard.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import s from '@/components/StoreCard.module.css';

interface StoreCardProps {
    id: string;
    children?: React.ReactNode;
}

export default function StoreCard({ id, children }: StoreCardProps) {
    const router = useRouter();
    const pathname = usePathname();

    // Модалка открыта, только если URL строго соответствует этой карточке
    const isOpen = pathname === `/card/${id}`;

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    layoutId={`card-bg-${id}`}
                    className={s.expandedCard}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <button
                        className={s.closeButton}
                        onClick={() => router.back()}
                    >
                        ✕
                    </button>
                    <div className={s.innerScrollableContent}>
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
