// Service Worker para PWA con notificaciones push

// Versión del cache
const CACHE_NAME = 'cero-v1'

// Archivos a cachear
const urlsToCache = [
  '/',
  '/manifest.json',
  '/cero192.png',
  '/cero512.png'
]

// Instalación del Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache)
      })
  )
})

// Activación del Service Worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Fetch - estrategia Network First
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        // Si la respuesta es válida, clonarla y guardarla en cache
        if (response && response.status === 200) {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache)
            })
        }
        return response
      })
      .catch(function() {
        // Si falla el fetch, buscar en cache
        return caches.match(event.request)
      })
  )
})

// ====== NOTIFICACIONES PUSH ======

// Escuchar eventos de notificaciones push
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body,
      icon: data.icon || '/cero192.png',
      badge: data.badge || '/cero192.png',
      vibrate: [200, 100, 200],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
        .then(() => {
          // Notificar a la página para actualizar datos
          return self.clients.matchAll().then(clients => {
            clients.forEach(client => client.postMessage({ type: 'notification' }))
          })
        })
    )
  }
})

// Manejar clic en la notificación
self.addEventListener('notificationclick', function(event) {
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow('/')
  )
})