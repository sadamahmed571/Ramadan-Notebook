// Service Worker لتطبيق القرآن الكريم
const CACHE_NAME = 'quran-app-v2';
const STATIC_CACHE = 'quran-static-v2';
const DYNAMIC_CACHE = 'quran-dynamic-v2';

// الملفات الأساسية التي يجب تخزينها دائماً
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/quran.html',
    '/app-report.md',
    '/assets/quran.json',
    '/assets/js/lib/lucide.min.js'
];

// تثبيت Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// تفعيل Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim()))
    );
});

// استراتيجية التخزين: Cache First مع Network Fallback
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // تجاهل طلبات غير HTTP
    if (!request.method.startsWith('GET')) {
        return;
    }

    // تجاهل طلبات Chrome Extensions
    if (url.protocol === 'chrome-extension:') {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then(response => {
                // إذا وجدنا في الكاش، نرجعه
                if (response) {
                    return response;
                }

                // إذا كان طلب صفحة HTML، نحاول من الشبكة
                if (request.headers.get('accept').includes('text/html')) {
                    return fetch(request)
                        .then(networkResponse => {
                            // تخزين الصفحة في الكاش الدينامي
                            if (networkResponse.ok) {
                                return caches.open(DYNAMIC_CACHE)
                                    .then(cache => cache.put(request, networkResponse.clone()))
                                    .then(() => networkResponse);
                            }
                            return networkResponse;
                        })
                        .catch(() => {
                            // إذا فشل الشبكة، نرجع صفحة خطأ مناسبة
                            return new Response('لا يوجد اتصال بالإنترنت', {
                                status: 503,
                                statusText: 'Service Unavailable',
                                headers: { 'Content-Type': 'text/html; charset=utf-8' }
                            });
                        });
                }

                // للملفات الأخرى، نحاول من الشبكة
                return fetch(request)
                    .then(networkResponse => {
                        // تخزين الملفات الثابتة في الكاش الثابت
                        if (networkResponse.ok && STATIC_ASSETS.includes(url.pathname)) {
                            return caches.open(STATIC_CACHE)
                                .then(cache => cache.put(request, networkResponse.clone()))
                                .then(() => networkResponse);
                        }
                        // تخزين الملفات الدينامية في الكاش الدينامي
                        if (networkResponse.ok) {
                            return caches.open(DYNAMIC_CACHE)
                                .then(cache => cache.put(request, networkResponse.clone()))
                                .then(() => networkResponse);
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        // إذا فشل الشبكة، نرجع خطأ مناسب
                        return new Response('لا يوجد اتصال بالإنترنت', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});

// معالجة الرسائل من التطبيق
self.addEventListener('message', event => {
    const { type, payload } = event.data;

    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;

        case 'GET_VERSION':
            event.ports[0].postMessage({
                type: 'VERSION_RESPONSE',
                payload: CACHE_NAME
            });
            break;

        case 'GET_CACHES':
            event.ports[0].postMessage({
                type: 'CACHES_RESPONSE',
                payload: [STATIC_CACHE, DYNAMIC_CACHE]
            });
            break;

        case 'CLEAR_CACHE':
            event.waitUntil(
                caches.delete(STATIC_CACHE)
                    .then(() => caches.delete(DYNAMIC_CACHE))
                    .then(() => {
                        event.ports[0].postMessage({
                            type: 'CACHE_CLEARED'
                        });
                    })
            );
            break;

        default:
            console.log('Unknown message type:', type);
    }
});

// مزامنة الخلفات عند التحديث
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SYNC_FILES') {
        const files = event.data.files;

        files.forEach(file => {
            fetch(file.url)
                .then(response => response.text())
                .then(content => {
                    // تحديث الملف في التخزين المحلي
                    localStorage.setItem(file.key, content);
                })
                .catch(error => {
                    console.error('Error syncing file:', file.key, error);
                });
        });
    }
});
