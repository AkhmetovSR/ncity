// app/[[...slug]]/page.tsx
import HomeGridClient from '../HomeGridClient';

interface CatchAllProps {
    params: Promise<{ slug?: string[] }>;
}

/**
 * Серверный компонент-контроллер.
 * Отвечает за SEO и первоначальный рендеринг страницы на сервере.
 */
export default async function CatchAllPage({ params }: CatchAllProps) {
    // 1. Получаем параметры пути на сервере (в Next.js params — это Promise)
    const { slug } = await params;

    // Стабильный массив данных карточек для генерации сетки
    const cards = [
        { id: '1', path: 'vacancy', title: 'Вакансии', desc: 'Присоединяйтесь к нашей команде' },
        { id: '2', path: 'about-us', title: 'О нас', desc: 'Узнайте больше о нашей компании' },
        { id: '3', path: 'contacts', title: 'Контакты', desc: 'Свяжитесь с нами в любое время' }
    ];

    // 2. Определяем, открыта ли карточка при ПРЯМОМ заходе (например, из поисковика)
    // Если URL вида /card/vacancy, то slug будет ['card', 'vacancy']
    const initialModalOpen = slug?.[0] === 'card';
    const initialActiveId = initialModalOpen ? slug?.[1] || '' : '';

    return (
        <main style={{ padding: '32px 16px' }}>
            {/*<h1 style={{ color: '#fff', textAlign: 'center', marginBottom: '32px' }}>Главная страница</h1>*/}
            {/*
              Передаем сетке не только карточки, но и начальное состояние роута.
              Если пользователь обновит страницу на /card/vacancy, клиентский компонент
              сразу узнает, какую модалку нужно открыть при гидратации.
            */}
            <HomeGridClient
                cards={cards}
                initialActiveId={initialActiveId}
            />
        </main>
    );
}
