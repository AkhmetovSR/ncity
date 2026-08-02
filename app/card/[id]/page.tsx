import React, { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CARD_REGISTRY } from '@/app/cards';
import s from './page.module.css';

interface Props {
    params: Promise<{ id: string }>;
}

// 1. ГЕНЕРАЦИЯ МЕТАДАННЫХ
export async function generateMetadata({ params }: Props) {
    const { id } = await params;
    const card = CARD_REGISTRY[id];

    const titles: Record<string, string> = {
        'travel': '5 Inspiring Apps for Your Next Trip',
        'coding': 'Как верстают архитекторы интерфейсов',
        'vacancy': 'Доступные вакансии'
    };

    const pageTitle = card ? titles[id] || 'Карточка' : '404 Not Found';
    return { title: `${pageTitle} | App Store` };
}

// 2. СТАТИЧЕСКАЯ СТРАНИЦА КАРТОЧКИ
export default function StaticCardPage({ params }: Props) {
    const { id } = use(params);
    const card = CARD_REGISTRY[id];

    if (!card) notFound();

    const ContentComponent = card.cardComponent;

    return (
        <main className={s.staticMain}>
            <article className={s.article}>
                <Link href="/" className={s.backButton}>
                    ← Назад на главную
                </Link>
                <div className={s.text}>
                    {/* 🌟 Передаем isOpen={true}, чтобы компонент отрендерил большой контент */}
                    <ContentComponent isOpen={true} />
                </div>
            </article>
        </main>
    );
}
