import { notFound } from 'next/navigation';
import Vacancy from '@/app/components/Vacancy';
import AboutUs from '@/app/components/AboutUs';
import Contacts from '@/app/components/Contacts';

const COMPONENT_MAP: Record<string, React.ComponentType> = {
    'vacancy': Vacancy,
    'about-us': AboutUs,
    'contacts': Contacts,
};

interface PageProps {
    params: Promise<{ id: string[] }>;
}

export default async function StaticCardPage({ params }: PageProps) {
    const { id } = await params;
    const currentId = id?.[0] || '';


    const SelectedComponent = COMPONENT_MAP[currentId];

    if (!SelectedComponent) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full border border-gray-100">
                {/* Чистый рендеринг без анимации для SEO-ботов и прямых заходов */}
                <SelectedComponent />
            </div>
        </div>
    );
}
