import React from "react";
import type { Metadata, Viewport } from "next";
import Menu from "@/components/Menu/Menu";
import s from "./layout.module.css";

// 🌟 СЕНЬОР-ФИКС 1: Жесткие настройки экрана для смартфонов (убираем зум и прыжки высоты)
export const viewport: Viewport = {
    themeColor: "#09090b", // Замените на цвет вашего фона (hex)
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,   // Запрещает мобильный зум, интерфейс ощущается нативным
    viewportFit: "cover",  // Разрешает контенту заходить под челку iPhone
};

// 🌟 СЕНЬОР-ФИКС 2: Метатеги PWA для iOS (Safari)
export const metadata: Metadata = {
    title: "Smart Job App",
    description: "Мобильное приложение для поиска работы",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent", // Контент элегантно заезжает под статус-бар
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
            <Menu />
        </div>

        {/* 🌟 СЕНЬОР-ФИКС 3: Нативная и безопасная регистрация Сервис-Воркера */}
        {/* Работает только на продакшене (Vercel), не мешает при разработке на localhost */}
        <script
            dangerouslySetInnerHTML={{
                __html: `
                            if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
                                window.addEventListener('load', function() {
                                    navigator.serviceWorker.register('/sw.js').then(function(reg) {
                                        console.log('ServiceWorker успешно зарегистрирован. Скоуп:', reg.scope);
                                    }).catch(function(err) {
                                        console.error('Ошибка регистрации ServiceWorker:', err);
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
