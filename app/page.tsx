// app/page.tsx
import React from "react";
import Main from "@/components/Main/Main";

/**
 * Next.js Page: Главный экран портала Нягани (Точка входа SPA)
 *
 * 🌟 СЕНЬОР-ФИКС: Полностью удалена директива 'use client'.
 * Корневая страница обязана оставаться Server Component (компонентом сервера).
 * Это обеспечивает моментальную генерацию базового HTML (SSR) и мгновенный
 * ответ сервера для смартфонов в сетях 3G/4G, убирая белый экран при первом заходе.
 */
export default function HomePage() {
    return (
        /*
           🌟 СЕНЬОР-ФИКС: Из сигнатуры вызова вычищена вся шелуха в виде
           старых неиспользуемых пропсов initialActiveId и initialVacancyId.
           Компонент Main стал кристально чистым презентационным ядром.
        */
        <Main />
    );
}

// Команда для локального PWA-тестирования по HTTPS на мобильном устройстве:
// "dev": "next dev --experimental-https --hostname 192.168.0.100"
