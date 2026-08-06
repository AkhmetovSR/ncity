import React from 'react';
import dynamic from 'next/dynamic';

// 1. Динамические импорты компонентов (Code Splitting)
const WidgetWaterBalance = dynamic<{ isOpen: boolean }>(() => import('@/components/Home/WidgetWaterBalance/WidgetWaterBalance'));
const AI = dynamic<{ isOpen: boolean }>(() => import('@/components/Home/AI/AI'));
const A = dynamic<{ isOpen: boolean }>(() => import('@/components/Home/a/A'));
const B = dynamic<{ isOpen: boolean }>(() => import('@/components/Home/b/B'));
const WaterBalance = dynamic<{ isOpen: boolean }>(() => import('@/components/freeService/WaterBalance/WaterBalance'));

// 🌟 Важно: Наш список вакансий теперь импортируется так же динамически
const VacancyList = dynamic<{ isOpen: boolean }>(() => import('@/components/Home/Job/VacancyList/VacancyList'));

export interface CardData {
    id: string;
    widget: React.ComponentType<{ isOpen: boolean }>;
    cardComponent: React.ComponentType<{ isOpen: boolean }>;
}

// 2. РЕЕСТР ДЛЯ СЕТКИ (CardGrid использует ТОЛЬКО его, как и раньше)
export const CARD_REGISTRY: Record<string, CardData> = {
    'travel': { id: 'travel', widget: WidgetWaterBalance, cardComponent: WaterBalance },
    'coding': { id: 'coding', widget: AI, cardComponent: AI },
    'A': { id: 'A', widget: AI, cardComponent: A },
    'B': { id: 'B', widget: AI, cardComponent: B }
};

// 3. 🌟 СЕНЬОР-РЕШЕНИЕ: Глобальный реестр ВСЕХ страниц приложения.
// Сюда входят и карточки из сетки, и любые независимые промо-карточки (vacancy).
export const PAGE_REGISTRY: Record<string, React.ComponentType<{ isOpen: boolean }>> = {
    // Автоматически копируем компоненты страниц из реестра сетки
    'travel': WaterBalance,
    'coding': AI,
    'A': A,
    'B': B,

    // 🌟 Добавляем нашу независимую промо-карточку.
    // TypeScript строго следит, чтобы пропсы VacancyList подходили под { isOpen: boolean }
    'vacancy': VacancyList as React.ComponentType<{ isOpen: boolean }>
};
