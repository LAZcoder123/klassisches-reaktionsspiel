const cacheName = 'reaktionsspiel-cache-v1';

const filesToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './apple-touch-icon.png',
  './beep.mp3'
];

// Beim Installieren cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(filesToCache))
  );
  self.skipWaiting(); // Direkt aktivieren
});

// Alte Caches löschen beim Aktivieren
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== cacheName).map(key => caches.delete(key)))
    )
  );
  self.clients.claim(); // Sofort Kontrolle übernehmen
});

// Netzwerkanfragen abfangen
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then(response => response || fetch(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  }
});

// Push-Nachrichten anzeigen
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
