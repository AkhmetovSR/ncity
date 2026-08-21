// app/profile/page.tsx

/**
 * Страница-заглушка Профиля пользователя.
 * Рендерится как полноценный независимый роут.
 */
export default function AboutPage() {
    return (
        <div style={{
            padding: '32px 16px',
            color: '#fff',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh'
        }}>
            <span style={{ fontSize: '48px', marginBottom: '16px' }}>👤</span>
            <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
                О нас
            </h1>
            <p style={{ color: '#71717a', fontSize: '15px', maxWidth: '280px', margin: '0 auto' }}>
                Раздел находится в разработке. Здесь будет профиль соискателя и настройки PWA приложения.
            </p>
        </div>
    );
}
