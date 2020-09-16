var CACHE_NAME = 'qr-code-generator-v1';
var STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/images/icons-192.png',
  '/js/main.js',
  '/js/qrcode.min.js'
];

//This is the install event listener
self.addEventListener("install", (event) => {
    console.log(self);
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            cache.addAll(STATIC_ASSETS).then(() => {
                    self.skipWaiting();
                }).catch(error => {
                    console.log("An error occured while adding static assets to the cache");
                    console.log(error);
                })
        })
    );
    console.log("Service Worker: Installed");
});

self.addEventListener('activate', event => {
    const currentCaches = [CACHE_NAME];
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
      }).then(cachesToDelete => {
        return Promise.all(cachesToDelete.map(cacheToDelete => {
          return caches.delete(cacheToDelete);
        }));
      }).then(() => self.clients.claim())
    );
  });

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
          return fetch(event.request);
        }
      )
    );
  });