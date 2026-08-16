// // public/sw.js
// const CACHE_NAME = 'smart-job-cache-v2'; // 🌟 Повышаем версию при обновлении структуры кэша
// const ASSETS_TO_CACHE = [
//     '/',
//     '/favicon.ico',
// ];
//
// // Установка воркера и кэширование базовой статики
// self.addEventListener('install', (event) => {
//     event.waitUntil(
//         caches.open(CACHE_NAME).then((cache) => {
//             // Используем { Изменение: игнорируем ошибки отдельных файлов }, чтобы из-за одной пропавшей иконки не падал весь воркер
//             return Promise.allSettled(
//                 ASSETS_TO_CACHE.map(url =>
//                     cache.add(url).catch(err => console.warn(`Не удалось закэшировать: ${url}`, err))
//                 )
//             );
//         })
//     );
//     self.skipWaiting(); // Мгновенно активируем новый воркер, заменяя старый
// });
//
// // Активация и удаление старых версий кэша
// self.addEventListener('activate', (event) => {
//     event.waitUntil(
//         caches.keys().then((keys) => {
//             return Promise.all(
//                 keys.map((key) => {
//                     if (key !== CACHE_NAME) {
//                         console.log('Удален старый кэш:', key);
//                         return caches.delete(key);
//                     }
//                 })
//             );
//         })
//     );
//     self.clients.claim(); // Мгновенно берем под контроль все открытые вкладки приложения
// });
//
// // Стратегия: Stale-While-Revalidate с защитой от сбоев Next.js роутинга
// self.addEventListener('fetch', (event) => {
//     // 🌟 СЕНЬОР-ФИКС: Исключаем запросы Next.js сборщика (_next/webpack-hmr), API, метрики и POST-методы
//     if (
//         event.request.url.includes('/_next/webpack-hmr') ||
//         event.request.url.includes('/api/') ||
//         !event.request.url.startsWith(self.location.origin) ||
//         event.request.method !== 'GET'
//     ) {
//         return;
//     }
//
//     event.respondWith(
//         caches.open(CACHE_NAME).then((cache) => {
//             return cache.match(event.request).then((cachedResponse) => {
//                 const fetchedResponse = fetch(event.request)
//                     .then((networkResponse) => {
//                         // Обновляем кэш только валидными ответами (статус 200, тип 'basic' — наш домен)
//                         if (networkResponse.status === 200 && networkResponse.type === 'basic') {
//                             cache.put(event.request, networkResponse.clone());
//                         }
//                         return networkResponse;
//                     })
//                     .catch((err) => {
//                         // Офлайн-заглушка: если сеть недоступна, возвращаем закэшированный корень для SPA-навигации
//                         if (event.request.mode === 'navigate') {
//                             return cache.match('/');
//                         }
//                         throw err;
//                     });
//
//                 // Возвращаем кэш мгновенно, если он есть, иначе берем из сети
//                 return cachedResponse || fetchedResponse;
//             });
//         })
//     );
// });

// public/sw.js

// Оставляем установку (install) и активацию (activate) как у вас,
// но в ASSETS_TO_CACHE убираем корень '/', оставляя только иконки:
const ASSETS_TO_CACHE = ['/favicon.ico'];

self.addEventListener('fetch', (event) => {
    // 1. Фильтр исключений (ваша базовая логика с доработкой)
    if (
        event.request.url.includes('/_next/webpack-hmr') || // Next.js Hot Reload
        event.request.url.includes('/api/') ||              // Запросы к бэкенду
        event.request.method !== 'GET' ||                   // Мутирующие запросы
        !event.request.url.startsWith(self.location.origin) // Внешние ресурсы (метрики, шрифты)
    ) {
        return;
    }

    const url = new URL(event.request.url);

    /**
     * СТРАТЕГИЯ 1: Cache-First (Сначала кэш)
     * Для неизменяемой статики Next.js (_next/static/...), картинок и иконок.
     * У этих файлов хэш зашит в имя, они никогда не изменятся на сервере.
     */
    if (url.pathname.startsWith('/_next/static/') || url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|woff2)$/)) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse; // Мгновенно отдаем из кэша

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
     * Для HTML-страниц, самого корня '/' и системных prefetch-данных Next.js.
     * Защищает от багов "старого кода" при деплоях.
     */
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return fetch(event.request)
                .then((networkResponse) => {
                    // Если сеть ок — обновляем кэш свежайшими данными
                    if (networkResponse.status === 200 && networkResponse.type === 'basic') {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // ОФЛАЙН-РЕЖИМ: Если интернета нет, пытаемся достать из кэша
                    return cache.match(event.request).then((cachedResponse) => {
                        if (cachedResponse) return cachedResponse;

                        // Если в кэше конкретной страницы нет, а пользователь пытается переключить роут —
                        // отдаем сохраненный корень, чтобы SPA-роутинг Next.js перехватил управление в оффлайне
                        if (event.request.mode === 'navigate') {
                            return cache.match('/');
                        }
                    });
                });
        })
    );
});
