const CACHE_NAME = 'smart-job-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/favicon.ico',
    // Сюда можно добавить статичные локальные шрифты или критичные иконки
];

// Установка воркера и кэширование базовой статики
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Активация и удаление старых версий кэша
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        })
    );
    self.clients.claim();
});

// Стратегия: Stale-While-Revalidate (Идеально для мобильного UI)
self.addEventListener('fetch', (event) => {
    // Не кэшируем запросы к API, внешние метрики и POST-запросы
    if (
        event.request.url.includes('/api/') ||
        !event.request.url.startsWith(self.location.origin) ||
        event.request.method !== 'GET'
    ) {
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
                const fetchedResponse = fetch(event.request).then((networkResponse) => {
                    // Обновляем кэш свежим ответом из сети
                    if (networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(() => {
                    // Офлайн: если сеть упала, а в кэше ничего нет, можно вернуть дефолтную заглушку
                });

                // Возвращаем кэш мгновенно, если он есть, иначе ждем сеть
                return cachedResponse || fetchedResponse;
            });
        })
    );
});
