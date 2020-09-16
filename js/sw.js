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
