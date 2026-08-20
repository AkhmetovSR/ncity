// app/[[[...slug]]]/page.tsx
import HomeGridClient from '../HomeGridClient';
import ModalClientContainer from '@/app/components/ModalClientContainer';
import ModalAnimateWrapper from '@/app/components/ModalAnimateWrapper';
import Vacancy from '@/app/components/Vacancy';
import AboutUs from '@/app/components/AboutUs';
import Contacts from '@/app/components/Contacts';

const COMPONENT_MAP: Record<string, React.ComponentType> = {
    'vacancy': Vacancy,
    'about-us': AboutUs,
    'contacts': Contacts,
};

interface CatchAllProps {
    params: Promise<{ slug?: string[] }>;
}

export default async function CatchAllPage({ params }: CatchAllProps) {
    const { slug } = await params;

    const cards = [
        { id: '1', path: 'vacancy', title: 'Вакансии', desc: 'Присоединяйтесь к нашей команде' },
        { id: '2', path: 'about-us', title: 'О нас', desc: 'Узнайте больше о нашей компании' },
        { id: '3', path: 'contacts', title: 'Контакты', desc: 'Свяжитесь с нами в любое время' }
    ];

    // Безопасно проверяем первый элемент через опциональную цепочку ?.
    const isModalOpen = slug?.[0] === 'card';
    const currentId = isModalOpen ? slug?.[1] || '' : '';
    const SelectedComponent = COMPONENT_MAP[currentId];

    return (
        <main style={{ padding: '32px 16px' }}>
            <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '32px' }}>Главная страница</h1>

            <HomeGridClient cards={cards} />

            <ModalAnimateWrapper>
                {isModalOpen && SelectedComponent && (
                    <ModalClientContainer id={currentId}>
                        <SelectedComponent />
                    </ModalClientContainer>
                )}
            </ModalAnimateWrapper>
        </main>
    );
}
