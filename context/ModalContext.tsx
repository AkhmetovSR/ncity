'use client';

import React, { createContext, useContext, useState } from "react";

// Описание интерфейса контекста
interface ModalContextType {
    isModalActive: boolean;
    setModalActive: (active: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * Провайдер контекста, который оборачивает все приложение.
 */
export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [isModalActive, setModalActive] = useState(false);

    return (
        <ModalContext.Provider value={{ isModalActive, setModalActive }}>
            {children}
        </ModalContext.Provider>
    );
}

/**
 * Хук для удобного использования контекста в компонентах.
 */
export function useModalContext() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModalContext должен использоваться внутри ModalProvider");
    }
    return context;
}
