import React from 'react';
import dynamic from 'next/dynamic';

const Actions = dynamic<{ isOpen: boolean }>(() => import('@/components/Home/Actions/Actions'));
const AI = dynamic<{ isOpen: boolean }>(() => import('@/components/Home/AI/AI'));

export interface CardData {
    id: string;
    cardComponent: React.ComponentType<{ isOpen: boolean }>;
}

export const CARD_REGISTRY: Record<string, CardData> = {
    'travel': {
        id: 'travel',
        cardComponent: Actions,
    },
    'coding': {
        id: 'coding',
        cardComponent: AI,
    },
};
