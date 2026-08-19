import HomeGridClient from './HomeGridClient';

export default function HomePage() {
    const cards = [
        { id: '1', path: 'vacancy', title: 'Вакансии', desc: 'Присоединяйтесь к нашей команде' },
        { id: '2', path: 'about-us', title: 'О нас', desc: 'Узнайте больше о нашей компании' },
        { id: '3', path: 'contacts', title: 'Контакты', desc: 'Свяжитесь с нами в любое время' }
    ];

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">Главная страница</h1>
            {/* Просто передаем данные в клиентскую сетку */}
            <HomeGridClient cards={cards} />
        </main>
    );
}
