// // app/components/ModalClientContainer.tsx
// 'use client';
//
// import { motion } from 'framer-motion';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import styles from '@/app/components/Modal.module.css';
//
// interface ContainerProps {
//     id: string;
//     children: React.ReactNode;
//     onClose: () => void;
// }
//
// export default function ModalClientContainer({ id, children, onClose }: ContainerProps) {
//     const router = useRouter();
//
//     const handleClose = () => {
//         // Проверяем метку прямого захода в историю браузера
//         const isDirect = window.history.state?.isDirectEntry === true;
//
//         if (isDirect) {
//             // Каноничный SPA-переход на главную страницу Next.js
//             router.push('/');
//             onClose();
//         } else {
//             // Возврат по истории для обычных переходов внутри приложения
//             onClose();
//             window.history.back();
//         }
//     };
//
//     // Слушаем клавишу Escape для закрытия
//     useEffect(() => {
//         const handleKeyDown = (e: KeyboardEvent) => {
//             if (e.key === 'Escape') handleClose();
//         };
//         window.addEventListener('keydown', handleKeyDown);
//         return () => window.removeEventListener('keydown', handleKeyDown);
//     }, [router]); // router добавлен в зависимости для стабильности эффекта
//
//     return (
//         <motion.div
//             layoutId={id}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.45 }}
//             className={styles.modalNode}
//         >
//             <button onClick={handleClose} className={styles.closeButton} aria-label="Закрыть">
//                 ✕
//             </button>
//             <div className={styles.scrollContent}>
//                 {children}
//             </div>
//         </motion.div>
//     );
// }

// app/components/ModalClientContainer.tsx
'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/components/Modal.module.css';

interface ContainerProps {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
}

export default function ModalClientContainer({ id, children, onClose }: ContainerProps) {
    const router = useRouter();

    const handleClose = () => {
        // Проверяем, зашел ли пользователь на эту модалку по прямой ссылке.
        // Мы ищем маркер 'direct-modal', который записали в HomeGridClient на Шаге 1.
        const isDirect = window.history.state?.type === 'direct-modal';

        if (isDirect) {
            // КАНОН NEXT.JS: Если заход прямой из поисковика — делаем SPA-переход на главную.
            // Next.js сам обновит URL на '/', а AnimatePresence запустит exit-анимацию.
            router.push('/');
            onClose();
        } else {
            // ОБЫЧНЫЙ ВАРИАНТ: Если пришли с главной — сначала уведомляем родительский стейт
            // для старта плавной анимации закрытия, а затем делаем обычный шаг назад в истории.
            onClose();
            window.history.back();
        }
    };

    // Слушаем клавишу Escape для закрытия модалки физической клавиатурой
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);

    return (
        <motion.div
            layoutId={id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.45 }}
            className={styles.modalNode}
        >
            <button onClick={handleClose} className={styles.closeButton} aria-label="Закрыть">
                ✕
            </button>
            <div className={styles.scrollContent}>
                {children}
            </div>
        </motion.div>
    );
}
