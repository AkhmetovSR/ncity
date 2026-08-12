import React from 'react';
import dynamic from 'next/dynamic';
import { VacancyListProps } from '@/components/Home/Job/VacancyList/VacancyList';

// 1. Обычные пропсы для стандартных карточек
interface DefaultPageProps {
    isOpen: boolean;
}

const WidgetWaterBalance = dynamic<DefaultPageProps>(() => import('@/components/Home/WidgetWaterBalance/WidgetWaterBalance'));
const AI = dynamic<DefaultPageProps>(() => import('@/components/Home/AI/AI'));
const A = dynamic<DefaultPageProps>(() => import('@/components/Home/a/A'));
const B = dynamic<DefaultPageProps>(() => import('@/components/Home/b/B'));
const WaterBalance = dynamic<DefaultPageProps>(() => import('@/components/freeService/WaterBalance/WaterBalance'));

// Родные пропсы для списка вакансий
const VacancyList = dynamic<VacancyListProps>(() => import('@/components/Home/Job/VacancyList/VacancyList'));

export interface CardData {
    id: string;
    widget: React.ComponentType<DefaultPageProps>;
    cardComponent: React.ComponentType<DefaultPageProps>;
}

export const CARD_REGISTRY: Record<string, CardData> = {
    'WidgetWaterBalance': { id: 'WidgetWaterBalance', widget: WidgetWaterBalance, cardComponent: WaterBalance },
    'coding': { id: 'coding', widget: AI, cardComponent: AI },
    'A': { id: 'A', widget: AI, cardComponent: A },
    'B': { id: 'B', widget: AI, cardComponent: B }
};

// 🌟 СЕНЬОР-РЕШЕНИЕ БЕЗ ANY:
// Мы явно говорим, что компонент в реестре принимает ЛИБО DefaultPageProps, ЛИБО VacancyListProps
type RegistryComponent = React.ComponentType<DefaultPageProps> | React.ComponentType<VacancyListProps>;

export const PAGE_REGISTRY: Record<string, RegistryComponent> = {
    'travel': WaterBalance,
    'coding': AI,
    'A': A,
    'B': B,
    'vacancy': VacancyList // Теперь встает сюда идеально и безопасно!
};
