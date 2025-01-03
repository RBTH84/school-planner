self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/dessinicone2-192.png',
        '/dessinicone2-512.png',
        '/styles.css',
        '/script.js',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/dessinicone2-192.png',
    badge: '/dessinicone2-192.png',
    vibrate: [100, 50, 100],
  };

  event.waitUntil(
    self.registration.showNotification('School Planner', options)
  );
});