const cacheName = 'reaktionsspiel-cache-v1';
const filesToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './beep.mp3',
  // Falls du weitere Dateien hast, hier hinzufügen
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Benachrichtigung';
  const options = {
    body: data.body || 'Neue Nachricht',
    icon: 'icon.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
