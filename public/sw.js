// // public/sw.js
//
// // 1. Обязательно объявляем имя кэша (иначе будет ошибка "CACHE_NAME is not defined")
// const CACHE_NAME = 'nyagan-job-cache-v1';
//
// // 2. Включаем '/' обратно! Это критически важно для стратегии Network-First.
// // Если пользователь зайдет в приложение без интернета, SW должен иметь в кэше
// // базовый HTML-шаблон ('/'), чтобы запустить SPA-роутер.
// const ASSETS_TO_CACHE = ['/', '/favicon.ico'];
//
// // Стандартные события установки и активации
// self.addEventListener('install', (event) => {
//     event.waitUntil(
//         caches.open(CACHE_NAME).then((cache) => {
//             return cache.addAll(ASSETS_TO_CACHE);
//         })
//     );
//     self.skipWaiting();
// });
//
// self.addEventListener('activate', (event) => {
//     event.waitUntil(
//         caches.keys().then((cacheNames) => {
//             return Promise.all(
//                 cacheNames.map((cache) => {
//                     if (cache !== CACHE_NAME) {
//                         return caches.delete(cache);
//                     }
//                 })
//             );
//         })
//     );
//     self.clients.claim();
// });
//
// self.addEventListener('fetch', (event) => {
//     // Исключения: HMR, API, не-GET и внешние ресурсы
//     if (
//         event.request.url.includes('/_next/webpack-hmr') ||
//         event.request.url.includes('/api/') ||
//         event.request.method !== 'GET' ||
//         !event.request.url.startsWith(self.location.origin)
//     ) {
//         return;
//     }
//
//     const url = new URL(event.request.url);
//
//     /**
//      * СТРАТЕГИЯ 1: Cache-First (Сначала кэш)
//      * Для хэшированной статики, картинок и шрифтов.
//      */
//     if (url.pathname.startsWith('/_next/static/') || url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|woff2)$/)) {
//         event.respondWith(
//             caches.open(CACHE_NAME).then((cache) => {
//                 return cache.match(event.request).then((cachedResponse) => {
//                     if (cachedResponse) return cachedResponse;
//
//                     return fetch(event.request).then((networkResponse) => {
//                         if (networkResponse.status === 200) {
//                             cache.put(event.request, networkResponse.clone());
//                         }
//                         return networkResponse;
//                     });
//                 });
//             })
//         );
//         return;
//     }
//
//     /**
//      * СТРАТЕГИЯ 2: Network-First (Сначала сеть)
//      * Для HTML, страниц вакансий и системных prefetch-данных Next.js.
//      */
//     event.respondWith(
//         caches.open(CACHE_NAME).then((cache) => {
//             return fetch(event.request)
//                 .then((networkResponse) => {
//                     if (networkResponse.status === 200 && networkResponse.type === 'basic') {
//                         cache.put(event.request, networkResponse.clone());
//                     }
//                     return networkResponse;
//                 })
//                 .catch(() => {
//                     // ОФЛАЙН-РЕЖИМ
//                     return cache.match(event.request).then((cachedResponse) => {
//                         if (cachedResponse) return cachedResponse;
//
//                         // Если конкретной страницы нет в кэше, отдаем закэшированный корень '/',
//                         // чтобы Next.js запустил JS-роутинг и показал интерфейс (например, страницу 404/офлайн)
//                         if (event.request.mode === 'navigate') {
//                             return cache.match('/');
//                         }
//                     });
//                 });
//         })
//     );
// });

// public/sw.js

// 1. Имя хранилища кэша на устройстве пользователя
const CACHE_NAME = 'nyagan-job-cache-v1';

// 2. Базовые файлы интерфейса для старта приложения в офлайне
const ASSETS_TO_CACHE = ['/', '/favicon.ico'];

// Событие установки: сохраняем базовый HTML-шаблон на диск
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Событие активации: безопасно удаляем старый кэш предыдущих версий приложения
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

// Единый перехватчик сетевых запросов приложения
self.addEventListener('fetch', (event) => {
    // Исключения: HMR, не-GET запросы и сторонние ресурсы (их SW не трогает)
    if (
        event.request.url.includes('/_next/webpack-hmr') ||
        event.request.method !== 'GET' ||
        !event.request.url.startsWith(self.location.origin)
    ) {
        return;
    }

    const url = new URL(event.request.url);

    /**
     * СТРАТЕГИЯ 1: Stale-While-Revalidate (Умное кэширование топа вакансий)
     * Срабатывает СТРОГО на первую страницу списка (offset=0 или когда параметра нет).
     * Мгновенно показывает топ-50 с диска телефона, а в фоне тихо обновляет его из БД.
     * Запросы скролла (offset=50, 100 и т.д.) сюда НЕ попадут и память устройства не займут.
     */
    if (url.pathname === '/vacancy/api' && (url.searchParams.get('offset') === '0' || !url.searchParams.has('offset'))) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    // Асинхронный запрос в сеть за свежими вакансиями из БД
                    const networkFetch = fetch(event.request).then((networkResponse) => {
                        if (networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone()); // Обновляем топ-50 на диске
                        }
                        return networkResponse;
                    }).catch(() => console.log('Фоновое обновление топа вакансий не удалось (офлайн)'));

                    // Отдаем сохраненные вакансии за 1мс. Если кэш пуст — ждем сеть
                    return cachedResponse || networkFetch;
                });
            })
        );
        return;
    }

    /**
     * СТРАТЕГИЯ 2: Cache-First (Сначала кэш)
     * Для хэшированных файлов сборки Next.js, картинок, иконок и шрифтов.
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
     * СТРАТЕГИЯ 3: Network-First (Сначала сеть)
     * Срабатывает для HTML-страниц, prefetch-данных Next.js, а ТАКЖЕ для всех последующих
     * порций вакансий при скролле (offset=50, offset=100), которые мы пустили в обход кэша диска.
     */
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return fetch(event.request)
                .then((networkResponse) => {
                    // Кэшируем только чистые HTML-страницы для офлайн-навигации.
                    // API-запросы пагинации (offset > 0) на диск устройства сохраняться НЕ БУДУТ.
                    if (networkResponse.status === 200 && networkResponse.type === 'basic') {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // ОФЛАЙН-РЕЖИМ: если у пользователя пропала сеть
                    return cache.match(event.request).then((cachedResponse) => {
                        if (cachedResponse) return cachedResponse;

                        // Если конкретного роута нет на диске, отдаем '/', чтобы Next.js запустил JS-роутер
                        if (event.request.mode === 'navigate') {
                            return cache.match('/');
                        }
                    });
                });
        })
    );
});
