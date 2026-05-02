// Agash Tracker — Service Worker
const CACHE_NAME = 'agash-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install — cache core assets
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// Activate — clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => clients.claim())
  );
});

// Fetch — network first, fall back to cache
self.addEventListener('fetch', event => {
  // Skip non-GET and Firebase/external requests
  if (event.request.method !== 'GET') return;
  const url = event.request.url;
  if (url.includes('firestore.googleapis.com') ||
      url.includes('firebase') ||
      url.includes('googleapis.com') ||
      url.includes('fonts.g') ||
      url.includes('cdnjs')) return;

  event.respondWith(
    fetch(event.request)
      .then(res => {
        // Cache fresh response
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});

// Message — force update
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
