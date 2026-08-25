// app/layout.tsx
import React from "react";
import type {Metadata, Viewport} from "next";
import Script from "next/script";
import s from "@/app/layout.module.css"; // Стили для базовой разметки (body, контейнеры)
import Menu from "@/app/components/Menu";
import Title from "@/components/Home/Title/Title"; // Компонент нижнего навигационного меню

/**
 * НАСТРОЙКИ ЭКРАНА (VIEWPORT) ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ
 * Отвечают за масштабирование, цвет системных панелей и растягивание под челку.
 */
export const viewport: Viewport = {
    // Цвет панели браузера или статус-бара PWA (здесь: темно-серый, почти черный)
    themeColor: "#09090b",

    // Заставляет верстку строго соответствовать физической ширине экрана смартфона
    width: "device-width",

    // Начальный масштаб 100% при открытии приложения
    initialScale: 1,

    // Запрещает пользователю случайно "зумить" (увеличивать) интерфейс пальцами,
    // что делает веб-сайт визуально неотличимым от нативного мобильного приложения
    maximumScale: 1,

    // КРИТИЧЕСКИ ВАЖНО ДЛЯ IPHONE: заставляет приложение растягиваться на весь экран,
    // включая зоны под челкой (Notch), Динамическим островом и нижней полосой Home Indicator.
    viewportFit: "cover",
};

/**
 * МЕТАДАННЫЕ И СУПЕР-НАСТРОЙКИ ДЛЯ СИСТЕМЫ IOS (APPLE PWA)
 * Apple исторически игнорирует некоторые стандартные поля манифеста,
 * поэтому для Safari и iPhone эти параметры прописываются вручную здесь.
 */
export const metadata: Metadata = {
    title: "asd", // Заголовок вкладки в браузере
    description: "Мобильное приложение для поиска работы", // Описание для поисковиков

    appleWebApp: {
        // Разрешает добавлять сайт на экран "Домой" на iOS как полноценное приложение.
        // Без этого флага при запуске с экрана смартфона это будет просто вкладка в Safari.
        capable: true,

        // Магия для челки: "black-translucent" делает верхний статус-бар (где часы и батарея)
        // полностью прозрачным. Контент приложения заезжает на самый верх, а системные часы
        // будут красиво отображаться белым текстом поверх вашего интерфейса.
        statusBarStyle: "black-translucent",

        // Имя приложения, которое отобразится под иконкой на рабочем столе iPhone
        title: "x",
    },
};

// Корневой компонент-обертка для всего сайта
export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru">
        <body className={s.rootBody}>
        <div className={s.Main}>
            {/*<div className={s.Title}>*/}
                {/*<Title/>*/}
            {/*</div>*/}
            {/*
          Основной контейнер для страниц приложения.
          Внутри s.mainContent в CSS обязательно нужно задать padding-top: env(safe-area-inset-top);
          чтобы отодвинуть текст вакансий из-под физической челки айфона.
        */}
            <div className={s.mainContent}>
                {children} {/* Сюда подставляется контент текущей страницы */}
            </div>

            {/*
          Нижнее меню навигации приложения.
          Внутри компонента Menu в CSS нужно задать padding-bottom: env(safe-area-inset-bottom);
          чтобы кнопки меню не накладывались на системную полоску закрытия приложений на iPhone.
        */}
            <div className={s.Menu}>
                <Menu/>
            </div>
        </div>


        {/*
          СКРИПТ РЕГИСТРАЦИИ SERVICE WORKER (СЕРВИСНОГО ВОРКЕРА)
          strategy="afterInteractive" говорит Next.js загрузить этот скрипт чуть позже,
          чтобы он не тормозил первоначальную загрузку и отрисовку интерфейса.
        */}
        <Script id="register-pwa-sw" strategy="afterInteractive">
            {`
                        // Проверяем, поддерживает ли текущий браузер технологию Сервис-Воркеров
                        if ('serviceWorker' in navigator) {
                            // Ждем полной загрузки всех картинок и стилей страницы
                            window.addEventListener('load', function() {
                                // Регистрируем наш файл управления кэшем public/sw.js
                                navigator.serviceWorker.register('/sw.js')
                                    // Если регистрация прошла успешно, ничего не делаем (или пишем в консоль)
                                    .catch(err => console.error('Ошибка регистрации SW:', err));
                            });
                        }
                    `}
        </Script>
        </body>
        </html>
    );
}
