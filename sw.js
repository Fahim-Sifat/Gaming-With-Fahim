// ======================================================
// 1. THIRD-PARTY INTEGRATION (5gvci.com)
// ======================================================
self.options = {
    "domain": "5gvci.com",
    "zoneId": 1 // Set to 1 based on the input '00000001'
}
self.lary = ""
// Loads the external script provided by the third-party.
importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw')


// ======================================================
// 2. CORE PWA CACHING LOGIC (For Offline Functionality)
// ======================================================
const STATIC_CACHE_NAME = 'gwf-static-v1'; // *** VERSION BUMPED for new assets ***
const DYNAMIC_CACHE_NAME = 'gwf-dynamic-v1';

// List of ALL core assets to cache on install for full offline use.
const staticAssets = [
  '/', 
  '/index.html',
  '/categories.html',
  '/top-rated.html',
  '/community.html',
  '/login.html',
  '/tic-tac-toe',
  '/sudoku',
  '/chess',
  '/candy-crush',
  '/puzzle-strategy-games',
  '/snake-game',
  '/rock-paper-scissor',
  '/droplets-catcher',
  '/space-blaster',
  '/action-adventure-games',
  '/alphabet-adventure',
  '/number-guess',
  '/coloring-fun',
  '/math-mania',
  '/learning-games',
  '/about-us',
  '/privacypolicy',
  '/contact',
  '/terms-conditions',
  '/bubble-shooter',
  '/letter-scramble',
  '/periodic-table',
  '/privacy-policy.html'
  ];

// INSTALL event: Caches the core static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching App Shell');
        return cache.addAll(staticAssets);
      })
  );
  self.skipWaiting();
});

// ACTIVATE event: Deletes old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => {
          return name !== STATIC_CACHE_NAME && name !== DYNAMIC_CACHE_NAME;
        }).map(name => {
          return caches.delete(name);
        })
      );
    })
  );
  return self.clients.claim();
});

// FETCH event: Cache First, then Network strategy
self.addEventListener('fetch', event => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      })
    );
  }
});