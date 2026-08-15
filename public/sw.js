// public/sw.js
const CACHE_NAME = 'smart-job-cache-v2'; // 🌟 Повышаем версию при обновлении структуры кэша
const ASSETS_TO_CACHE = [
    '/',
    '/favicon.ico',
];

// Установка воркера и кэширование базовой статики
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Используем { Изменение: игнорируем ошибки отдельных файлов }, чтобы из-за одной пропавшей иконки не падал весь воркер
            return Promise.allSettled(
                ASSETS_TO_CACHE.map(url =>
                    cache.add(url).catch(err => console.warn(`Не удалось закэшировать: ${url}`, err))
                )
            );
        })
    );
    self.skipWaiting(); // Мгновенно активируем новый воркер, заменяя старый
});

// Активация и удаление старых версий кэша
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('Удален старый кэш:', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Мгновенно берем под контроль все открытые вкладки приложения
});

// Стратегия: Stale-While-Revalidate с защитой от сбоев Next.js роутинга
self.addEventListener('fetch', (event) => {
    // 🌟 СЕНЬОР-ФИКС: Исключаем запросы Next.js сборщика (_next/webpack-hmr), API, метрики и POST-методы
    if (
        event.request.url.includes('/_next/webpack-hmr') ||
        event.request.url.includes('/api/') ||
        !event.request.url.startsWith(self.location.origin) ||
        event.request.method !== 'GET'
    ) {
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
                const fetchedResponse = fetch(event.request)
                    .then((networkResponse) => {
                        // Обновляем кэш только валидными ответами (статус 200, тип 'basic' — наш домен)
                        if (networkResponse.status === 200 && networkResponse.type === 'basic') {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    })
                    .catch((err) => {
                        // Офлайн-заглушка: если сеть недоступна, возвращаем закэшированный корень для SPA-навигации
                        if (event.request.mode === 'navigate') {
                            return cache.match('/');
                        }
                        throw err;
                    });

                // Возвращаем кэш мгновенно, если он есть, иначе берем из сети
                return cachedResponse || fetchedResponse;
            });
        })
    );
});
