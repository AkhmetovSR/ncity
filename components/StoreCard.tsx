// // app/components/StoreCard.tsx
// 'use client';
//
// import { motion, AnimatePresence } from 'framer-motion';
// import s from '@/app/page.module.css';
//
// interface StoreCardProps {
//     id: string;
//     gradient?: string;
//     activeId: string | null;
//     setActiveId: (id: string | null) => void;
//     children?: React.ReactNode;
// }
//
// // const EXPANDED_TRANSITION = { type: 'spring', stiffness: 150, damping: 24 };
//
// export default function StoreCard({
//                                       id,
//                                       gradient = 'transparent',
//                                       activeId,
//                                       setActiveId,
//                                       children
//                                   }: StoreCardProps) {
//     const isOpen = activeId === id;
//
//     return (
//         <AnimatePresence>
//             {isOpen && (
//                 <motion.div
//                     layoutId={`card-bg-${id}`}
//                     className={s.expandedCard}
//                     // onClick={(e) => e.stopPropagation()} // Защита от закрытия при клике на контент
//                 >
//                     <button className={s.closeButton} onClick={() => setActiveId(null)}>
//                         ✕
//                     </button>
//                     <div className={s.contentWrapper}>
//                         {children}
//                     </div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );
// }

// app/components/StoreCard.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation'; // Привязываемся к URL напрямую
import s from '@/app/page.module.css';

interface StoreCardProps {
    id: string;
    gradient?: string;
    children?: React.ReactNode;
}

/**
 * Компонент модального окна Apple-style (StoreCard)
 * Вычисляет состояние открытости из URL, закрывается нативной имитацией кнопки "Назад".
 */
export default function StoreCard({
                                      id,
                                      gradient = 'transparent',
                                      children
                                  }: StoreCardProps) {
    const pathname = usePathname();

    // Самостоятельно вычисляем открытость модалки из текущего URL
    const isOpen = pathname.startsWith(`/card/${id}`);

    /**
     * Закрытие крестиком через идеальную имитацию системной кнопки "Назад".
     * Браузер стирает URL, Next.js убирает параллельный слот, а карточки возвращают видимость.
     */
    const handleClose = () => {
        if (typeof window !== 'undefined') {
            window.history.back(); // Имитируем системную кнопку "Назад"
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    layoutId={`card-bg-${id}`}
                    className={s.expandedCard}
                    style={{ background: gradient }}
                >
                    {/* Кнопка закрытия жестко связана с историей браузера */}
                    <button
                        className={s.closeButton}
                        onClick={handleClose}
                        aria-label="Закрыть окно"
                    >
                        ✕
                    </button>

                    <div className={s.contentWrapper}>
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
