import React from 'react';
import dynamic from 'next/dynamic';

// Импортируем компоненты динамически
const WidgetWaterBalance = dynamic<{ isOpen: boolean }>(() => import('@/components/Home/WidgetWaterBalance/WidgetWaterBalance'));
const AI = dynamic<{ isOpen: boolean }>(() => import('@/components/Home/AI/AI'));
const A = dynamic<{ isOpen: boolean }>(() => import('@/components/Home/a/A'));
const B = dynamic<{ isOpen: boolean }>(() => import('@/components/Home/b/B'));
const WaterBalance = dynamic<{ isOpen: boolean }>(() => import('@/components/freeService/WaterBalance'));

export interface CardData {
    id: string;
    widget: React.ComponentType<{ isOpen: boolean }>;       // Передаем сюда стейт
    cardComponent: React.ComponentType<{ isOpen: boolean }>; // Передаем сюда стейт
}

export const CARD_REGISTRY: Record<string, CardData> = {
    'travel': {
        id: 'travel', // 🌟 ID должен совпадать с ключом реестра, чтобы роутер его нашел
        widget: WidgetWaterBalance, // 🌟 Убрали кавычки, теперь это реальный компонент виджета!
        cardComponent: WaterBalance,
    },
    'coding': {
        id: 'coding',
        widget: AI, // Использует тот же виджет WidgetWaterBalance
        cardComponent: AI,
    },
    'A': {
        id: 'A',
        widget: AI,
        cardComponent: A,
    },
    'B': {
        id: 'B',
        widget: AI,
        cardComponent: B,
    }
};
