import React from "react";
import type { Metadata, Viewport } from "next";
import Menu from "@/components/Menu/Menu";
import s from "./layout.module.css";
import PwaBadge from "@/components/PwaBadge/PwaBadge";

export const viewport: Viewport = {
    themeColor: "#09090b",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
};

export const metadata: Metadata = {
    title: "Smart Job App",
    description: "Мобильное приложение для поиска работы",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "SmartJob",
    },
};

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
            <Menu/>
        </div>

        <PwaBadge />

        {/* 🌟 СЕНЬОР-ФИКС: Стабильная и чистая регистрация без бесконечного сброса воркера */}
        <script
            dangerouslySetInnerHTML={{
                __html: `
                            if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
                                window.addEventListener('load', function() {
                                    navigator.serviceWorker.register('/sw.js').then(function(reg) {
                                        console.log('ServiceWorker успешно работает в скоупе:', reg.scope);
                                    }).catch(function(err) {
                                        console.error('Критическая ошибка ServiceWorker:', err);
                                    });
                                });
                            }
                        `,
            }}
        />
        </body>
        </html>
    );
}
