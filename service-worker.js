// Agash service worker — NETWORK-FIRST so devices never get stuck on an old
// cached index.html (old code was one cause of PINs/names "reverting").
const CACHE = 'agash-v4';

self.addEventListener('install', e => { self.skipWaiting(); });

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Never touch Firestore / Google API traffic
  if (/googleapis\.com|firebaseio\.com|gstatic\.com\/firebasejs/.test(url.host + url.pathname) &&
      !/fonts\./.test(url.host)) return;
  e.respondWith(
    fetch(req, url.origin === location.origin ? { cache: 'no-cache' } : undefined)
      .then(res => {
        if (res && res.ok && url.origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});
