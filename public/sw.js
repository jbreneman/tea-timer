// Use a cacheName for cache versioning
var cacheName = 'v2:static';

// During the installation phase, you'll usually want to cache static assets.
self.addEventListener('install', function(e) {
    // Once the service worker is installed, go ahead and fetch the resources to make this work offline.
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll([
                './',
                './assets/css/app.min.css',
                './assets/js/app.min.js',
                './assets/fonts/gilroy-extrabold-webfont.woff',
                './assets/fonts/gilroy-extrabold-webfont.woff2',
                './assets/fonts/gilroy-light-webfont.woff',
                './assets/fonts/gilroy-light-webfont.woff2',
                './assets/images/background.jpg'
            ]).then(function() {
                self.skipWaiting();
            });
        })
    );
});

// when the browser fetches a URL…
self.addEventListener('fetch', function(event) {
    // … either respond with the cached object or go ahead and fetch the actual URL
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                // retrieve from cache
                return response;
            }
            // fetch as normal
            return fetch(event.request);
        })
    );
});