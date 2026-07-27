// 'use client';
//
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { usePathname } from 'next/navigation';
//
// // Интерфейс для строгой типизации TypeScript
// interface ModalContextType {
//     activeModal: string | null;       // ID открытого виджета (например, "vacancy")
//     openModal: (id: string) => void;  // Функция открытия
//     closeModal: () => void;           // Функция закрытия
// }
//
// const ModalContext = createContext<ModalContextType | undefined>(undefined);
//
// export function ModalProvider({ children }: { children: React.ReactNode }) {
//     const pathname = usePathname();
//     const [activeModal, setActiveModal] = useState<string | null>(null);
//
//     // СИНХРОНИЗАЦИЯ С URL (Для SEO, кнопок "Назад" и F5):
//     // Если путь в браузере меняется (например, нажали назад или пришли по ссылке),
//     // этот эффект автоматически синхронизирует стейт анимации с адресной строкой.
//     useEffect(() => {
//         if (pathname && pathname.startsWith('/view/')) {
//             const typeFromUrl = pathname.replace('/view/', '');
//             setActiveModal(typeFromUrl);
//         } else {
//             setActiveModal(null);
//         }
//     }, [pathname]);
//
//     const openModal = (id: string) => setActiveModal(id);
//     const closeModal = () => setActiveModal(null);
//
//     return (
//         <ModalContext.Provider value={{ activeModal, openModal, closeModal }}>
//             {children}
//         </ModalContext.Provider>
//     );
// }
//
// // Кастомный хук для быстрого доступа к контексту
// export const useModal = () => {
//     const context = useContext(ModalContext);
//     if (!context) throw new Error('useModal must be used within ModalProvider');
//     return context;
// };
