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
  console.log('Push event received:', event);
  const options = {
    body: event.data ? event.data.text() : 'Notification par défaut',
    icon: '/dessinicone2-192.png',
    badge: '/dessinicone2-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open',
        title: 'Ouvrir l\'application'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('School Planner', options)
  );
});

// Fonction pour envoyer une notification locale
self.scheduleDailyNotification = async (time) => {
  const [hours, minutes] = time.split(':');
  const now = new Date();
  let notificationTime = new Date(now);
  notificationTime.setHours(parseInt(hours, 10));
  notificationTime.setMinutes(parseInt(minutes, 10));
  notificationTime.setSeconds(0);

  if (notificationTime < now) {
    notificationTime.setDate(notificationTime.getDate() + 1);
  }

  const delay = notificationTime.getTime() - now.getTime();
  
  setTimeout(() => {
    self.registration.showNotification('School Planner', {
      body: 'N\'oublie pas de vérifier ton sac pour demain !',
      icon: '/dessinicone2-192.png',
      badge: '/dessinicone2-192.png',
      vibrate: [100, 50, 100],
    });
    
    // Planifier la prochaine notification pour le lendemain
    self.scheduleDailyNotification(time);
  }, delay);
};

// Écouter les messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    console.log('Scheduling notification for time:', event.data.time);
    self.scheduleDailyNotification(event.data.time);
  }
});