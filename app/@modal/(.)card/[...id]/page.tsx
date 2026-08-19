import { Suspense } from 'react';
import ModalClientContainer from './ModalClientContainer';
import Vacancy from '@/app/components/Vacancy';
import AboutUs from '@/app/components/AboutUs';
import Contacts from '@/app/components/Contacts';

const COMPONENT_MAP: Record<string, React.ComponentType> = {
    'vacancy': Vacancy,
    'about-us': AboutUs,
    'contacts': Contacts,
};

interface ModalProps {
    params: Promise<{ id: string[] }>;
}

export default async function InterceptedCardModal({ params }: ModalProps) {
    const { id } = await params;
    const currentId = id?.[0] || '';

    const SelectedComponent = COMPONENT_MAP[currentId];

    return (
        <ModalClientContainer id={currentId}>
            {SelectedComponent ? (
                <Suspense fallback={<div style={{ color: '#000' }}>Загрузка...</div>}>
                    <SelectedComponent />
                </Suspense>
            ) : (
                <div style={{ color: '#000' }}>Контент не найден</div>
            )}
        </ModalClientContainer>
    );
}
