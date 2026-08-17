// app/@modal/(.)card/[id]/page.tsx
import React from 'react';
import StoreCard from '@/components/StoreCard';
import VacancyList from "@/components/Home/Job/VacancyList/VacancyList";

interface Props {
    params: Promise<{ id: string }>; // В Next.js 15 params — это Promise
}

export default async function InterceptorModalPage({ params }: Props) {
    const { id } = await params;

    // Функция-маппер: определяет, какой контент рендерить внутри модалки на основе ID в URL
    const renderWidgetContent = (cardId: string) => {
        if (cardId === 'vacancy') {
            return <VacancyList />;
        }

        // Сюда можно добавить условия для других карточек, например:
        // if (cardId === 'promo') return <PromoDetails />;

        return <div>Контент для карточки {cardId} не найден</div>;
    };

    return (
        <StoreCard id={id}>
            {renderWidgetContent(id)}
        </StoreCard>
    );
}
