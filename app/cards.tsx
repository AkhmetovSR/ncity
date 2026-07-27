import React from 'react';
import dynamic from 'next/dynamic';

// Используем dynamic импорты, чтобы код тяжелых страниц не грузился весь сразу на главной
const Actions = dynamic(() => import('@/components/Home/Actions/Actions'));
const AI = dynamic(() => import('@/components/Home/AI/AI'));

export interface CardData {
    id: string;
    tag: string;
    title: string;
    gradient: string;
    component: React.ComponentType;
}

export const CARD_REGISTRY: Record<string, CardData> = {
    'travel': {
        id: 'travel',
        tag: 'App of the day',
        title: '5 Inspiring Apps for Your Next Trip',
        gradient: 'linear-gradient(135deg, #0071e3, #42a5f5)',
        component: Actions,
    },
    'coding': {
        id: 'coding',
        tag: 'Senior Way',
        title: 'Как верстают архитекторы интерфейсов',
        gradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
        component: AI,
    },
};
