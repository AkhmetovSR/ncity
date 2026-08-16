// app/page.tsx
import React from "react";
import Main from "@/components/Main/Main"; // Импортируем наше интерактивное клиентское ядро интерфейса

/**
 * 🌟 ГЛАВНАЯ СТРАНИЦА ПОРТАЛА (Server Component / SSR)
 * Этот компонент выполняется строго на сервере Next.js [INDEX].
 * Роботы Яндекса и Google увидят чистый, готовый к индексации HTML-код главной страницы.
 */
export default function HomePage() {
    return (
        <Main
            initialActiveId={null}
            initialVacancyId={null}
        />
    );
}


// Команда для локального PWA-тестирования по HTTPS на мобильном устройстве:
// "dev": "next dev --experimental-https --hostname 192.168.0.100"
