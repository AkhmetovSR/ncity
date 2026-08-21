// app/components/DoubleExitHandler.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import styles from '@/app/components/DoubleExitHandler.module.css';

export default function DoubleExitHandler() {
    const pathname = usePathname();
    const [showToast, setShowToast] = useState(false);

    // Используем Refs, чтобы избежать перезапуска эффекта при изменении стейта
    const isReadyRef = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Логика работает исключительно на Главной странице
        if (pathname !== '/') return;

        // Создаем фантомный хэш в истории браузера
        if (!window.location.hash.includes('main')) {
            window.history.pushState(null, '', '#main');
        }

        const handlePopState = () => {
            // Если это второе нажатие в течение 2 секунд — выходим с сайта
            if (isReadyRef.current) {
                window.history.go(-1);
                return;
            }

            // --- ПЕРВОЕ НАЖАТИЕ НАЗАД ---
            setShowToast(true);
            isReadyRef.current = true;

            // Возвращаем фантомный хэш на место, временно запирая пользователя
            window.history.pushState(null, '', '#main');

            // Сбрасываем предыдущий таймер, если пользователь кликает слишком часто
            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            // Окно ожидания второго клика — 2 секунды
            timeoutRef.current = setTimeout(() => {
                isReadyRef.current = false;
                setShowToast(false);
            }, 2000);
        };

        // Подписываемся на системную кнопку «Назад»
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [pathname]); // Зависит только от пути, рассинхрон исключен

    // Рендерим плашку только на Главной и только по триггеру
    if (!showToast || pathname !== '/') return null;

    return (
        <div className={styles.toast}>
            <span>Нажмите ещё раз, чтобы выйти</span>
        </div>
    );
}
