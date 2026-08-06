'use client';

import React from "react";
import Main from "@/components/Main/Main";

/**
 * Next.js Page: Главный экран (Точка входа SPA без открытых модалок)
 */
export default function HomePage() {
    return (
        <Main
            initialActiveId={null}
            initialVacancyId={null}
        />
    );
}
