/**
 * BiocraftFlow Progressive Web App Service Worker
 * Handles on-screen background visual notification delivery.
 */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = { title: 'BiocraftFlow Alert', body: 'New surgical transaction or milestone update.' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'BiocraftFlow Alert', body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: '/icon.png',
    badge: '/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle custom on-screen showing messages triggered from background browser events
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag } = event.data;
    event.waitUntil(
      self.registration.showNotification(title, {
        body: body,
        icon: '/icon.png',
        badge: '/logo.png',
        tag: tag || 'biocraftflow-alert',
        vibrate: [150, 75, 150],
        silent: false,
        requireInteraction: false
      })
    );
  }
});

// Handle interaction (clicking on-screen banner focuses the browser tab instantly)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus if tab exists
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new portal root
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});
