import React from "react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import s from "./layout.module.css";
import ModalAnimateWrapper from "@/app/components/ModalAnimateWrapper";

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

            {/* Слот модалки с AnimatePresence для анимации закрытия */}
            <ModalAnimateWrapper>
                {modal}
            </ModalAnimateWrapper>
        </div>

        <Script id="register-pwa-sw" strategy="afterInteractive">
            {`
                    if ('serviceWorker' in navigator) {
                        window.addEventListener('load', function() {
                            navigator.serviceWorker.register('/sw.js').catch(err => console.error(err));
                        });
                    }
                `}
        </Script>
        </body>
        </html>
    );
}
