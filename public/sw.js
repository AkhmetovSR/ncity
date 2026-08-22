// public/sw.js

// 1. Обязательно объявляем имя кэша (иначе будет ошибка "CACHE_NAME is not defined")
const CACHE_NAME = 'nyagan-job-cache-v1';

// 2. Включаем '/' обратно! Это критически важно для стратегии Network-First.
// Если пользователь зайдет в приложение без интернета, SW должен иметь в кэше
// базовый HTML-шаблон ('/'), чтобы запустить SPA-роутер.
const ASSETS_TO_CACHE = ['/', '/favicon.ico'];

// Стандартные события установки и активации
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Исключения: HMR, API, не-GET и внешние ресурсы
    if (
        event.request.url.includes('/_next/webpack-hmr') ||
        event.request.url.includes('/api/') ||
        event.request.method !== 'GET' ||
        !event.request.url.startsWith(self.location.origin)
    ) {
        return;
    }

    const url = new URL(event.request.url);

    /**
     * СТРАТЕГИЯ 1: Cache-First (Сначала кэш)
     * Для хэшированной статики, картинок и шрифтов.
     */
    if (url.pathname.startsWith('/_next/static/') || url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|woff2)$/)) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;

                    return fetch(event.request).then((networkResponse) => {
                        if (networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    });
                });
            })
        );
        return;
    }

    /**
     * СТРАТЕГИЯ 2: Network-First (Сначала сеть)
     * Для HTML, страниц вакансий и системных prefetch-данных Next.js.
     */
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return fetch(event.request)
                .then((networkResponse) => {
                    if (networkResponse.status === 200 && networkResponse.type === 'basic') {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // ОФЛАЙН-РЕЖИМ
                    return cache.match(event.request).then((cachedResponse) => {
                        if (cachedResponse) return cachedResponse;

                        // Если конкретной страницы нет в кэше, отдаем закэшированный корень '/',
                        // чтобы Next.js запустил JS-роутинг и показал интерфейс (например, страницу 404/офлайн)
                        if (event.request.mode === 'navigate') {
                            return cache.match('/');
                        }
                    });
                });
        })
    );
});
