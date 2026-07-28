import React, { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CARD_REGISTRY } from '@/app/cards';
import s from './page.module.css';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { id } = await params;
    const card = CARD_REGISTRY[id];
    return { title: card ? `${card.title} | App Store` : '404' };
}

export default function StaticCardPage({ params }: Props) {
    const { id } = use(params);
    const card = CARD_REGISTRY[id];

    if (!card) notFound();

    const ContentComponent = card.component;

    return (
        <main className={s.staticMain} style={{ background: card.gradient }}>
            <article className={s.article}>
                <Link href="/" className={s.backButton}>← Назад на главную</Link>
                <span className={s.tag}>{card.tag}</span>
                <h1 className={s.title}>{card.title}</h1>
                <div className={s.text}>
                    <ContentComponent />
                </div>
            </article>
        </main>
    );
}
