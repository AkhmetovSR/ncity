import { Suspense } from 'react';
import ModalClientContainer from './ModalClientContainer';
import Vacancy from '@/app/components/Vacancy';
import AboutUs from '@/app/components/AboutUs';
import Contacts from '@/app/components/Contacts';
import loaderStyles from './Loader.module.css'; // Импорт стилей лоадера

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
                <Suspense
                    fallback={
                        <div className={loaderStyles.skeletonWrapper}>
                            <div className={loaderStyles.line} style={{ height: '16px', width: '25%' }} />
                            <div className={loaderStyles.line} style={{ height: '32px', width: '75%', borderRadius: '12px', marginTop: '8px' }} />
                            <div className={loaderStyles.line} style={{ height: '16px', width: '100%', marginTop: '24px' }} />
                            <div className={loaderStyles.line} style={{ height: '16px', width: '83%' }} />
                            <div className={loaderStyles.line} style={{ height: '16px', width: '66%' }} />
                        </div>
                    }
                >
                    <SelectedComponent />
                </Suspense>
            ) : (
                <div>Контент не найден</div>
            )}
        </ModalClientContainer>
    );
}
