const dataCacheName = 'music-data';
const cacheName = 'music-app-pwa';
const filesToCache = [
    '/',
    '/index.html',
    '/main.js',
    '/css/style.css',
    '/manifest.json',
    '/images/background3.jpg',
    '/images/icon.png'
  ];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
      caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
            if (key !== cacheName && key !== dataCacheName) {           
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
    );
    return self.clients.claim();
  });

  self.addEventListener('fetch', function (e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    var dataUrl = 'https://folksa.ga/api/tracks?limit=1000&key=flat_eric';
    if (e.request.url.indexOf(dataUrl) > - 1) {
      // app hämtar fräsch data
      e.respondWith(
        caches.open(dataCacheName).then(function (cache) {
          return fetch(e.request).then(function (response) {
            cache.put(e.request.url, response.clone());
            return response;
          })
        })
      );
    } else {
      // app hämtar app shell
      e.respondWith(
        caches.match(e.request).then(function (response) {
          return response || fetch(e.request);
        })
      );
    }
  })  