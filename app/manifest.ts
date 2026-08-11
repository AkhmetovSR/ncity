import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Nyagan',
        short_name: 'Nyagan',
        description: 'Прогрессивное мобильное приложение для поиска работы',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#09090b',
        theme_color: '#09090b',
        icons: [
            {
                // Нативный путь, по которому Next.js отдаст сгенерированную иконку 192x192
                src: '/icon?size=192',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon?size=192',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable', // Экран Android сможет безопасно обрезать её в круг
            },
            {
                // Путь для большой иконки 512x512
                src: '/icon?size=512',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    };
}
