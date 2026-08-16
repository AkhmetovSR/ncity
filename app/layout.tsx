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
import Menu from "@/components/Menu/Menu"; // Твое нижнее навигационное меню (Таб-бар)
import s from "./layout.module.css"; // Глобальные стили разметки viewport
import PlaceHolder from "@/components/UI/PlaceHolder/PlaceHolder"; // Твой служебный компонент-заглушка
import { ModalProvider } from "@/components/ModalContext"; // Провайдер, синхронизирующий рантайм

// 🌟 НАСТРОЙКА VIEWPORT (Канон для Mobile PWA):
// Блокируем зум пальцами (maximumScale: 1, userScalable: no), чтобы приложение
// при хаотичных тапах по карточкам вели себя как нативная программа из App Store, а не веб-сайт.
// viewportFit: "cover" позволяет верстке затекать под челку и безопасные зоны iPhone.
export const viewport: Viewport = {
    themeColor: "#09090b", // Цвет статус-бара телефона в тон нашему фону
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    viewportFit: "cover",
};

// 🌟 МЕТАДАННЫЕ И ОПЦИИ APPLE WEB APP:
// Готовим сайт к добавлению на домашний экран смартфона ("Поделиться" -> "На экран Домой")
export const metadata: Metadata = {
    title: "Нягань",
    description: "Мобильное приложение для поиска работы",
    appleWebApp: {
        capable: true, // Разрешаем запускать сайт как полноценное приложение без интерфейса Safari
        statusBarStyle: "black-translucent", // Делаем статус-бар прозрачным, чтобы верстка затекала под часы
        title: "Н",
    },
};

export default function RootLayout({
                                       children,
                                       modal
                                   }: {
    children: React.ReactNode; // Сюда Next.js подставит главную страницу (app/page.tsx -> Main)
    modal: React.ReactNode;    // Сюда роутер подставит наш перехватчик-невидимку из @modal [INDEX]
}) {
    return (
        <html lang="ru">
        <body className={s.rootBody}>
        {/* 🌟 ГЛОБАЛЬНЫЙ КЛИЕНТСКИЙ КОНТУР: */}
        {/* Оборачиваем все интерактивное содержимое в ModalProvider, чтобы хук useAppHistory */}
        {/* и карточки имели единый контекст синхронизации параметров URL [INDEX]. */}
        <ModalProvider>
            <div className={s.mainContent}>
                {/* Рендерим главный экран (сетку, промо-карту, заголовки) */}
                {children}

                {/* 🌟 КАНОНИЧЕСКИЙ ПАРАЛЛЕЛЬНЫЙ СЛОТ Next.js: */}
                {/* Сюда роутер автоматически смонтирует скрытый узел из app/@modal/(.)card/[...id]/page.tsx [INDEX]. */}
                {/* Именно этот слот заставляет Next.js группировать переклики в истории браузера, */}
                {/* защищая интерфейс от "призраков" и самопроизвольных открытий окон [INDEX]. */}
                {modal}
            </div>
        </ModalProvider>

        {/* Нижнее меню навигации всегда закреплено поверх основного контента */}
        <div className={s.Menu}>
            <Menu/>
        </div>

        <PlaceHolder />

        {/* Нативный скрипт регистрации Service Worker для PWA-функционала оффлайна */}
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
