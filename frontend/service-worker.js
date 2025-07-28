const cacheName = 'reaktionsspiel-cache-v1';

const filesToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './apple-touch-icon.png',
  './beep.mp3'
];

// Install - Dateien cachen mit Fehlerbehandlung
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(filesToCache))
      .catch(err => console.error('Fehler beim Cachen:', err))
  );
  self.skipWaiting();
});

// Activate - alte Caches löschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== cacheName).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch - Cache-first Strategie mit Netzwerkfallback
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then(response => {
        return response || fetch(event.request).catch(() => caches.match('./index.html'));
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});

// Push Notifications mit erweiterten Optionen
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Benachrichtigung';
  const options = {
    body: data.body || 'Neue Nachricht',
    icon: 'icon.png',
    badge: 'icon.png',             // kleines Icon für Statusleiste
    vibrate: [100, 50, 100],      // Vibrationsmuster
    tag: 'reaktionsspiel-push',   // zum Zusammenfassen ähnlicher Notifs
    renotify: true,               // erneutes Benachrichtigen bei gleichem Tag
    actions: [                    // Action-Buttons (optional)
      {action: 'open', title: 'Öffnen'},
      {action: 'dismiss', title: 'Schließen'}
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Optional: Notification Click Event (z.B. um die App zu öffnen)
self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')  // öffnet deine App-Seite
    );
  }
});
