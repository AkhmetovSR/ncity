// app/@modal/default.tsx
'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { SharedModalContainer } from '@/app/@modal/SharedModalContainer';

/**
 * 🌟 СЕНЬОР-ФИКС: Этот компонент рендерится, когда мы находимся на Главной ('/').
 * Мы возвращаем контейнер модалки, но передаем в него isOpen={false}.
 * Благодаря этому узел модалки ВСЕГДА присутствует в DOM-дереве приложения.
 */
export default function DefaultModalSlot() {
    return (
        <AnimatePresence mode="wait">
            <SharedModalContainer isOpen={false} cardId={null} vacancyId={null} />
        </AnimatePresence>
    );
}
