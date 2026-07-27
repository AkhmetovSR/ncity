import { Link } from 'next-view-transitions';

export default function CardDetailPage({ params }: { params: { id: string } }) {
    return (
        // Имя должно строго совпадать с именем карточки на главной странице!
        <main
            style={{ viewTransitionName: `card-${params.id}` }}
            className="w-full min-h-screen bg-blue-600 text-white relative"
        >
            {/* Кнопка закрытия в стиле Apple */}
            <Link href="/" className="absolute top-6 right-6 bg-black/30 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">
                ✕
            </Link>

            <div className="max-w-2xl mx-auto p-8 pt-24">
                <span className="text-sm uppercase tracking-wider opacity-70">App of the day</span>
                <h1 className="text-5xl font-black mt-2">Бесшовный переход</h1>

                <p className="mt-8 text-lg leading-relaxed opacity-90">
                    Этот контент плавно проявляется, пока сама карточка растягивается на весь экран.
                    Навигация происходит между настоящими страницами Next.js, сохраняя правильные URL!
                </p>
            </div>
        </main>
    );
}
