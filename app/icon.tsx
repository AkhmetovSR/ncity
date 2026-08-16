// import { ImageResponse } from 'next/og';
//
// // Конфигурация иконок: Next.js автоматически вызовет этот файл
// // для генерации размеров 32x32, 192x192 и 512x512
// export const size = {
//     width: 512,
//     height: 512,
// };
// export const contentType = 'image/png';
//
// export default function Icon() {
//     return new ImageResponse(
//         (
//             <div
//                 style={{
//                     fontSize: 240,
//                     background: '#09090b', // Тёмный фон вашего приложения
//                     width: '100%',
//                     height: '100%',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     borderRadius: '24%', // Идеальное скругление для Android (maskable)
//                     color: '#ffffff',
//                     fontWeight: 'bold',
//                     fontFamily: 'sans-serif',
//                 }}
//             >
//                 💼 {/* Сюда можно поставить любой эмодзи или букву вашего бренда */}
//             </div>
//         ),
//         {
//             ...size,
//         }
//     );
// }

// app/layout.tsx
import React from "react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import Menu from "@/components/Menu/Menu";
import s from "./layout.module.css";
import PlaceHolder from "@/components/UI/PlaceHolder/PlaceHolder";

export const viewport: Viewport = {
    themeColor: "#09090b",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export const metadata: Metadata = {
    title: "Информационный портал Нягань",
    description: "Мобильное приложение для поиска работы",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Нягань PWA",
    },
};

export default function RootLayout({
                                       children,
                                       modal
                                   }: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <html lang="ru">
        <body className={s.rootBody}>
        <div className={s.mainContent}>
            {children}
            {modal} {/* Параллельный слот, куда Next.js нативно инжектит перехваченные модалки */}
        </div>
        <div className={s.Menu}>
            <Menu/>
        </div>
        <PlaceHolder />

        {/* Безопасная регистрация воркера (afterInteractive) без деструктивного unregister() */}
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
