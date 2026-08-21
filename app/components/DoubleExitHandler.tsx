// app/components/DoubleExitHandler.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import styles from '@/app/components/DoubleExitHandler.module.css';

export default function DoubleExitHandler() {
    const pathname = usePathname();
    const [showToast, setShowToast] = useState(false);

    const isReadyRef = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isLockedRef = useRef(false);

    useEffect(() => {
        // Логика перехвата работает исключительно на чистом корне '/'
        // Если открыты модалки (/card/...) или профиль — компонент полностью спит
        if (pathname !== '/') {
            // Если пользователь кликнул в меню на другую вкладку,
            // плавно убираем за собой блокирующую запись, делая стек истории плоским
            if (isLockedRef.current) {
                isLockedRef.current = false;
                window.history.back();
            }
            return;
        }

        // Запираем историю на главной странице чистым дубликатом без хэшей.
        // Передаем в стейт понятную метку 'app-root'
        if (!isLockedRef.current && window.history.state?.type !== 'app-root') {
            window.history.pushState({ type: 'app-root' }, '', '/');
            isLockedRef.current = true;
        }

        const handlePopState = () => {
            // Защита: если событие поймано не на главной — полностью игнорируем
            if (window.location.pathname !== '/') return;

            // СЕНЬОР-АНАЛИЗ СОСТОЯНИЯ ИСТОРИИ:
            // Если мы вернулись на главную, а в стейте остался маркер 'modal' или 'direct-modal',
            // это означает, что пользователь только что нажал на крестик (или сделал свайп назад)
            // внутри модального окна. Мы просто сбрасываем замок в false и молчим.
            const currentStateType = window.history.state?.type;
            if (currentStateType === 'modal' || currentStateType === 'direct-modal') {
                isLockedRef.current = false;
                return;
            }

            // Если это второе нажатие в течение 2 секунд — полностью закрываем вкладку/PWA
            if (isReadyRef.current) {
                window.history.go(-1);
                return;
            }

            // --- ПЕРВОЕ НАЖАТИЕ НАЗАД НА ГЛАВНОЙ (РЕАЛЬНЫЙ ВЫХОД ИЗ ПРИЛОЖЕНИЯ) ---
            setShowToast(true);
            isReadyRef.current = true;

            // Возвращаем запирающий элемент в стек истории на место
            window.history.pushState({ type: 'app-root' }, '', '/');

            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            // Окно ожидания второго клика — 2 секунды
            timeoutRef.current = setTimeout(() => {
                isReadyRef.current = false;
                setShowToast(false);
            }, 2000);
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [pathname]);

    // Рендерим плашку только на Главной и только по триггеру
    if (!showToast || pathname !== '/') return null;

    return (
        <div className={styles.toast}>
            <span>Нажмите ещё раз, чтобы выйти</span>
        </div>
    );
}
