import React from "react";
// import { ModalProvider } from "@/context/ModalContext";
import Menu from "@/components/Menu/Menu";
// Импортируем наш новый CSS-модуль
import s from "./layout.module.css";

export default function RootLayout({
                                       children,
                                       modal, // Принимаем параллельный маршрут
                                   }: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <html lang="ru">
        {/* Применяем класс .rootBody к тегу body */}
        <body className={s.rootBody}>
        {/*<ModalProvider>*/}

            {/* Верхние 80% экрана с независимым скроллом контента */}
            <div className={s.mainContent}>
                {children}
                {modal}
            </div>

            <div className={s.Menu}>
                <Menu/>
            </div>

        {/*</ModalProvider>*/}
        </body>
        </html>
    );
}
