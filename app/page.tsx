import HomeGridClient from './HomeGridClient';

export default function HomePage() {
    const cards = [
        { id: '1', path: 'vacancy', title: 'Вакансии', desc: 'Присоединяйтесь к нашей команде' },
        { id: '2', path: 'about-us', title: 'О нас', desc: 'Узнайте больше о нашей компании' },
        { id: '3', path: 'contacts', title: 'Контакты', desc: 'Свяжитесь с нами в любое время' }
    ];

    return (
        <main style={{ padding: '32px 16px' }}>
            <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '32px' }}>Главная страница</h1>
            <HomeGridClient cards={cards} />
        </main>
    );
}
