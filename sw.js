const CACHE_NAME = 'daftarhesab-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add('./'))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        const fresh = await fetch(e.request);
        cache.put(e.request, fresh.clone());
        return fresh;
      } catch (err) {
        const cached = await cache.match(e.request) || await cache.match('./');
        if (cached) return cached;
        throw err;
      }
    })
  );
});
