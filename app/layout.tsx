import React from "react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import Menu from "@/components/Menu/Menu";
import s from "./layout.module.css";
import PlaceHolder from "@/components/UI/PlaceHolder/PlaceHolder";
import ModalAnimateWrapper from "@/components/UI/ModalAnimateWrapper"; // Оставили только для плавной анимации закрытия

export const viewport: Viewport = {
    themeColor: "#09090b",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    viewportFit: "cover",
};

export const metadata: Metadata = {
    title: "Нягань",
    description: "Мобильное приложение для поиска работы",
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-icon.png",
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Н",
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

            {/* Оставляем обертку для корректной анимации AnimatePresence при router.back() */}
            <ModalAnimateWrapper>
                {modal}
            </ModalAnimateWrapper>
        </div>

        <div className={s.Menu}>
            <Menu/>
        </div>

        <PlaceHolder />

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
