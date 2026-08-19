'use client';

import { use } from 'react';
import ModalClientContainer from './ModalClientContainer';
import Vacancy from '@/app/components/Vacancy';
import AboutUs from '@/app/components/AboutUs';
import Contacts from '@/app/components/Contacts';

const COMPONENT_MAP: Record<string, React.ComponentType> = {
    'vacancy': Vacancy,
    'about-us': AboutUs,
    'contacts': Contacts,
};

export default function InterceptedCardModal({ params }: { params: Promise<{ id: string[] }> }) {
    const { id } = use(params);
    const currentId = id?.[0] || '';
    const SelectedComponent = COMPONENT_MAP[currentId];

    return (
        <ModalClientContainer id={currentId}>
            {SelectedComponent ? (
                /* Рендерим напрямую без Suspense для сохранения Shared Layout анимации */
                <SelectedComponent />
            ) : (
                <div style={{ color: '#000' }}>Контент не найден</div>
            )}
        </ModalClientContainer>
    );
}
