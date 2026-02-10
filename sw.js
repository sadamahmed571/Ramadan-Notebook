// Service Worker لمفكرة رمضان
const CACHE_NAME = 'ramadan-tracker-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json'
];

// التثبيت
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// التنشيط
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// الاسترجاع
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // العثور على مطابقة في الكاش
        if (response) {
          return response;
        }
        
        // استدعاء الشبكة إذا لم يتم العثور في الكاش
        return fetch(event.request).then(
          response => {
            // التحقق من أن الاستجابة صالحة
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // استنساخ الاستجابة
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

