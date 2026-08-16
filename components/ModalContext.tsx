// components/ModalContext.tsx
'use client'; // Директива клиентского контура: контекст работает в рантайме браузера

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Описываем структуру (интерфейс) данных, которые наш контекст будет раздавать компонентам
interface ModalContextType {
    activeId: string | null; // ID карточки, которая открыта в данный момент (например, "vacancy" или "travel")
    setActiveId: (id: string | null) => void; // Сеттер для обновления ID активной карточки
    activeVacancyId: string | null; // ID конкретной вакансии (нужен для глубокого роутинга внутри шторки)
    setActiveVacancyId: (id: string | null) => void; // Сеттер для обновления ID вакансии
}

// Создаем сам React Context с дефолтным значением undefined для безопасной проверки типов
const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * 🌟 ГЛОБАЛЬНЫЙ КЛИЕНТСКИЙ ПРОВАЙДЕР СИНХРОНИЗАЦИИ:
 * Оборачивает всё наше DOM-дерево в layout.tsx. Внутри него живут "живые" React-стейты,
 * которые нужны Framer Motion для моментальной реакции за 0 миллисекунд.
 */
export function ModalProvider({ children }: { children: ReactNode }) {
    // Инициализируем базовые стейты в null (при старте приложения все модалки закрыты)
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeVacancyId, setActiveVacancyId] = useState<string | null>(null);

    return (
        /*
           🌟 РАСПРЕДЕЛИТЕЛЬНЫЙ МУВ:
           Передаем стейты и их функции-сеттеры в провайдер.
           Сюда будет подключаться хук useAppHistory: он будет считывать канонический URL Next.js
           и вызывать функции setActiveId / setActiveVacancyId.
           Как только они вызовутся, карточки мгновенно узнают об изменении и запустят анимацию полёта.
        */
        <ModalContext.Provider value={{ activeId, setActiveId, activeVacancyId, setActiveVacancyId }}>
            {children}
        </ModalContext.Provider>
    );
}

/**
 * 🌟 УНИВЕРСАЛЬНЫЙ СЕНЬОР-ХУК ДЛЯ КОМПОНЕНТОВ:
 * Кастомный хук, который мы вызываем во всех карточках (CardGrid, SpecialPromoCard) и в useAppHistory,
 * чтобы мгновенно получить доступ к состоянию открытых окон без громоздких конструкций useContext.
 */
export function useModalState() {
    const context = useContext(ModalContext);

    // Безопасный предохранитель: если разработчик случайно вызовет этот хук в компоненте,
    // который забыли обернуть в <ModalProvider>, TypeScript и рантайм сразу выдадут понятную ошибку,
    // предотвращая молчаливое падение приложения.
    if (!context) {
        throw new Error('useModalState должен использоваться строго внутри ModalProvider');
    }

    return context;
}
