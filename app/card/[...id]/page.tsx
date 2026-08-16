// app/card/[[...id]]/page.tsx
import React from 'react';
import Main from "@/components/Main/Main"; // Наше интерактивное клиентское SPA-ядро интерфейса

export default function CardCatchAllPage() {
    return (
        <Main
            initialActiveId={null}
            initialVacancyId={null}
        />
    );
}
