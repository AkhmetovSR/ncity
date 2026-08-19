import { notFound } from 'next/navigation';
import Vacancy from '@/app/components/Vacancy';
import AboutUs from '@/app/components/AboutUs';
import Contacts from '@/app/components/Contacts';

const COMPONENT_MAP: Record<string, React.ComponentType> = {
    'vacancy': Vacancy,
    'about-us': AboutUs,
    'contacts': Contacts,
};

export default async function StaticCardPage({ params }: { params: Promise<{ id: string[] }> }) {
    const { id } = await params;
    const currentId = id?.[0] || '';

    const SelectedComponent = COMPONENT_MAP[currentId];

    if (!SelectedComponent) {
        notFound();
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#09090b', padding: '16px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '550px', width: '100%' }}>
                <SelectedComponent />
            </div>
        </div>
    );
}
