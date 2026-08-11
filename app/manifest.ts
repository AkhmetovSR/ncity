import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Нягань',
        short_name: 'Нягань',
        description: 'Прогрессивное мобильное приложение для поиска работы',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#09090b',
        theme_color: '#09090b',
        icons: [
            {
                // Путь к вашей статичной иконке в папке public
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon-maskable.png',
                sizes: '192x192 384x384 512x512', // Устройство само выберет нужный масштаб
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                // Путь к большой иконке
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    };
}
