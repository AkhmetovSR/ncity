// // app/layout.tsx
// import React from "react";
// import type { Metadata, Viewport } from "next";
// import Menu from "@/components/Menu/Menu";
// import s from "./layout.module.css";
// import PwaBadge from "@/components/PwaBadge/PwaBadge";
// import PlaceHolder from "@/components/UI/PlaceHolder/PlaceHolder";
//
// // 🌟 СЕНЬОР-ФИКС 1: Жесткие настройки экрана для смартфонов (убираем зум и прыжки высоты)
// export const viewport: Viewport = {
//     themeColor: "#09090b", // Замените на цвет вашего фона (hex)
//     width: "device-width",
//     initialScale: 1,
//     maximumScale: 1,
//     userScalable: false,   // Запрещает мобильный зум, интерфейс ощущается нативным
//     // viewportFit: "cover",  // Разрешает контенту заходить под челку iPhone
// };
//
// // 🌟 СЕНЬОР-ФИКС 2: Метатеги PWA для iOS (Safari)
// export const metadata: Metadata = {
//     title: "Нягань",
//     description: "Мобильное приложение для поиска работы",
//     appleWebApp: {
//         capable: true,
//         statusBarStyle: "black-translucent", // Контент элегантно заезжает под статус-бар
//         title: "Н",
//     },
// };
//
// export default function RootLayout({
//                                        children
//                                    }: {
//     children: React.ReactNode;
// }) {
//     return (
//         <html lang="ru">
//         <body className={s.rootBody}>
//         <div className={s.mainContent}>
//             {children}
//         </div>
//         <div className={s.Menu}>
//             <Menu/>
//         </div>
//
//
//         {/* 🌟 Заглушка поворота для iOS Safari */}
//         <PlaceHolder />
//         {/* Рендерим кнопку установки в верхнем углу */}
//         {/*<PwaBadge />*/}
//
//         {/* 🌟 СЕНЬОР-ФИКС 3: Нативная и безопасная регистрация Сервис-Воркера */}
//         {/* Работает только на продакшене (Vercel), не мешает при разработке на localhost */}
//         <script
//             dangerouslySetInnerHTML={{
//                 __html: `
//             if ('serviceWorker' in navigator) {
//                 window.addEventListener('load', function() {
//                     // Очищаем старые воркеры перед регистрацией, чтобы избежать конфликтов на Vercel
//                     navigator.serviceWorker.getRegistrations().then(function(registrations) {
//                         for(let registration of registrations) {
//                             registration.unregister();
//                         }
//                     });
//
//                     navigator.serviceWorker.register('/sw.js').then(function(reg) {
//                         console.log('ServiceWorker успешно зарегистрирован:', reg.scope);
//                     }).catch(function(err) {
//                         console.error('Ошибка ServiceWorker:', err);
//                     });
//                 });
//             }
//         `,
//             }}
//         />
//         </body>
//         </html>
//     );
// }

// app/layout.tsx
import React from "react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import Menu from "@/components/Menu/Menu";
import s from "./layout.module.css";
import PlaceHolder from "@/components/UI/PlaceHolder/PlaceHolder";

// 🌟 СЕНЬОР-ФИКС 1: Жесткие настройки экрана для смартфонов (убираем зум и прыжки высоты)
export const viewport: Viewport = {
    themeColor: "#09090b",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    // userScalable: false, // 🌟 УДАЛЕНО: Этот тег устарел и ломает доступность
    viewportFit: "cover",   // 🌟 ДОБАВЛЕНО: Разрешает контенту корректно заполнять Safe Area (под челку iPhone)
};

// 🌟 СЕНЬОР-ФИКС 2: Метатеги PWA для iOS (Safari)
export const metadata: Metadata = {
    title: "фыв",
    description: "Мобильное приложение для поиска работы",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent", // Контент элегантно заезжает под статус-бар
        title: "Н",
    },
};

export default function RootLayout({
                                       children,
                                       modal // 🌟 СЕНЬОР-ФИКС: Принимаем параллельный слот для модальных окон
                                   }: {
    children: React.ReactNode;
    modal: React.ReactNode;   // 🌟 СЕНЬОР-ФИКС: Описываем тип для слота модалки
}) {
    return (
        <html lang="ru">
        <body className={s.rootBody}>
        <div className={s.mainContent}>
            {children}
            {modal} {/* 🌟 СЕНЬОР-ФИКС: Рендерим модалку рядом с основным контентом, чтобы Next.js мог её перехватить */}
        </div>
        <div className={s.Menu}>
            <Menu/>
        </div>

        {/* 🌟 Заглушка поворота для iOS Safari */}
        <PlaceHolder />

        {/* 🌟 СЕНЬОР-ФИКС 3: Оптимизированная регистрация Сервис-Воркера через Next.js Script */}
        {/* Не блокирует основной поток рендеринга интерфейса (strategy="afterInteractive") */}
        {/* Удален деструктивный сброс кэша unregister(), убивавший оффлайн-режим */}
        <Script id="register-pwa-sw" strategy="afterInteractive">
            {`
                if ('serviceWorker' in navigator) {
                    window.addEventListener('load', function() {
                        navigator.serviceWorker.register('/sw.js')
                            .then(function(reg) {
                                console.log('ServiceWorker успешно зарегистрирован:', reg.scope);
                            })
                            .catch(function(err) {
                                console.error('Ошибка ServiceWorker:', err);
                            });
                    });
                }
            `}
        </Script>
        </body>
        </html>
    );
}
