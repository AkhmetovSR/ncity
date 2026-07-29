'use client';

import { StoreCard } from './StoreCard';

// Компонент принимает только стейт управления, чтобы синхронизироваться с остальными карточками
interface SpecialPromoCardProps {
    activeId: string | null;
    setActiveId: (id: string | null) => void;
}

// Внутренний контент, который нужен только этой карточке
function SpecialContent() {
    return (
        <div>
            <p>Это контент эксклюзивной карточки, импортированной отдельно!</p>
            {/* Сюда можно добавить кнопки, картинки или формы */}
        </div>
    );
}

export function SpecialPromoCard({ activeId, setActiveId }: SpecialPromoCardProps) {
    return (
        <div style={{ marginTop: '2rem' }}>
            <StoreCard
                id="special-promo"
                tag="Эксклюзив"
                title="Отдельная карточка"
                gradient="linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)"
                activeId={activeId}
                setActiveId={setActiveId}
            >
                <SpecialContent />
            </StoreCard>
        </div>
    );
}
