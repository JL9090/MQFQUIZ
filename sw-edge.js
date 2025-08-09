// Network-first SW to avoid stale caches (Edge/iOS safe)
const CACHE_NAME = '54hs-quiz-embed-v4';
const ASSETS = [
  './',
  'index.html',
  'style.css',
  'script-mobile-compat.js',
  'manifest.json',
  'emblem.jpg',
  'uh1n-action.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k === CACHE_NAME ? null : caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  event.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
      return res;
    }).catch(() => caches.match(req))
  );
});
