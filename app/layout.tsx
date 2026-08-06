import React from "react";
import Menu from "@/components/Menu/Menu";
import s from "./layout.module.css";

export default function RootLayout({
                                       children
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru">
        <body className={s.rootBody}>
        <div className={s.mainContent}>
            {children}
        </div>
        <div className={s.Menu}>
            <Menu />
        </div>
        </body>
        </html>
    );
}
