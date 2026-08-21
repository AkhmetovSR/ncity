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
    // Храним статус: заперли ли мы уже браузер на главной
    const isLockedRef = useRef(false);

    useEffect(() => {
        // Условие: мы находимся в домашней зоне (корень или открытая модалка карточки)
        const isHomeZone = pathname === '/' || pathname.startsWith('/card/');

        if (!isHomeZone) {
            // ЕСЛИ ПОЛЬЗОВАТЕЛЬ УШЕЛ ИЗ ДОМАШНЕЙ ЗОНЫ (например, на /profile):
            // Если история была заперта, мы обязаны сделать шаг назад,
            // чтобы убрать фантомную запись и сделать стек истории абсолютно плоским.
            if (isLockedRef.current) {
                isLockedRef.current = false;
                window.history.back();
            }
            return;
        }

        // Если мы в домашней зоне и история еще не заперта — запираем её чистым пушем
        if (!isLockedRef.current && window.history.state?.isAppRoot !== true) {
            window.history.pushState({ isAppRoot: true }, '', pathname);
            isLockedRef.current = true;
        }

        const handlePopState = (e: PopStateEvent) => {
            // Если в стейте истории нет флага корня — значит, пользователь перемещается внутри сайта, не трогаем его
            if (window.history.state?.isAppRoot !== true) {
                isLockedRef.current = false;
                return;
            }

            // Если это второе нажатие в течение 2 секунд — полностью закрываем приложение / вкладку
            if (isReadyRef.current) {
                window.history.go(-1);
                return;
            }

            // --- ПЕРВОЕ НАЖАТИЕ НАЗАД НА ГЛАВНОЙ ---
            setShowToast(true);
            isReadyRef.current = true;

            // Возвращаем запирающий элемент в стек истории на место
            window.history.pushState({ isAppRoot: true }, '', pathname);

            if (timeoutRef.current) clearTimeout(timeoutRef.current);

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

    if (!showToast) return null;

    return (
        <div className={styles.toast}>
            <span>Нажмите ещё раз, чтобы выйти</span>
        </div>
    );
}
