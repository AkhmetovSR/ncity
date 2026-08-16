// hooks/useAppHistory.ts
'use client';

import { useParams } from 'next/navigation';
import { useLayoutEffect, useRef } from 'react';

interface HistoryStates {
    setActiveId: (id: string | null) => void;
    setActiveVacancyId: (id: string | null) => void;
}

export function useAppHistory({ setActiveId, setActiveVacancyId }: HistoryStates) {
    const params = useParams();
    const prevParamsRef = useRef<string | null>(null);

    // --- ИСПОЛЬЗУЕМ useLayoutEffect ВМЕСТО useEffect ---
    // useLayoutEffect срабатывает СИНХРОННО после всех DOM-мутаций,
    // но ДО того, как браузер отрисует кадр
    useLayoutEffect(() => {
        const segments = Array.isArray(params?.id) ? params.id : params?.id ? [params.id] : [];
        const cardId = segments[0] || null;
        const vacancyId = segments[1] || null;

        // Сравниваем с предыдущим значением, чтобы избежать лишних обновлений
        const currentKey = `${cardId}-${vacancyId}`;
        if (prevParamsRef.current === currentKey) return;
        prevParamsRef.current = currentKey;

        // СИНХРОННО обновляем стейты
        setActiveId(cardId);
        setActiveVacancyId(vacancyId);

        // Блокировка скролла
        document.body.style.overflow = cardId ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [params, setActiveId, setActiveVacancyId]);

    // Отключаем скролл-рестор
    useLayoutEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }, []);
}