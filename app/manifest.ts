import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Smart Job App',
        short_name: 'SmartJob',
        description: 'Прогрессивное мобильное приложение для поиска работы',
        start_url: '/',
        display: 'standalone', // Полностью скрывает интерфейс браузера
        orientation: 'portrait', // Блокирует переворот экрана
        background_color: '#09090b', // Цвет подложки (совпадает с вашей темной темой)
        theme_color: '#09090b', // Цвет статус-бара в Android
        icons: [
            {
                src: '/icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable', // Иконка будет идеально круглой/квадратной на любом Android
            },
            {
                src: '/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
