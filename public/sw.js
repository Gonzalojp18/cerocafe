// Service Worker para PWA con notificaciones (sin iconos)

// Versión del cache
const CACHE_NAME = 'cero-v3'

// Archivos a cachear - SIMPLIFICADO
const urlsToCache = ['/']

// Instalación del Service Worker
self.addEventListener('install', function(event) {
  console.log('[SW] Instalando Service Worker...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('[SW] Archivos cacheados')
        return cache.addAll(urlsToCache)
      })
  )
  self.skipWaiting()
})

// Activación del Service Worker
self.addEventListener('activate', function(event) {
  console.log('[SW] Activando Service Worker...')
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Eliminando cache antiguo:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  return self.clients.claim()
})

// Fetch - estrategia Network First
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request)
      .then(function(response) {
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
        return caches.match(event.request)
      })
  )
})

// ====== NOTIFICACIONES LOCALES ======
self.addEventListener('message', function(event) {
  console.log('[SW] Mensaje recibido:', event.data)
  
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body } = event.data
    
    const options = {
      body: body,
      vibrate: [200, 100, 200],
      tag: 'puntos-notification',
      requireInteraction: false
    }

    event.waitUntil(
      self.registration.showNotification(title, options)
        .then(() => {
          console.log('[SW] Notificación mostrada')
        })
        .catch(err => {
          console.error('[SW] Error al mostrar notificación:', err)
        })
    )
  }
})

// Manejar clic en la notificación
self.addEventListener('notificationclick', function(event) {
  console.log('[SW] Click en notificación')
  event.notification.close()
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i]
          if ('focus' in client) {
            return client.focus()
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/')
        }
      })
  )
})

// ====== PUSH NOTIFICATIONS (desde servidor) ======
self.addEventListener('push', function(event) {
  console.log('[SW] 📬 Push recibido desde servidor')
  
  let notificationData = {
    title: '🔔 Nueva notificación',
    body: 'Tienes una actualización'
  }
  
  if (event.data) {
    try {
      notificationData = event.data.json()
      console.log('[SW] ✅ Datos del push:', notificationData)
    } catch (e) {
      console.error('[SW] ❌ Error al parsear datos del push:', e)
    }
  }
  
  const options = {
    body: notificationData.body,
    vibrate: [200, 100, 200, 100, 200],
    tag: 'cero-points-notification',
    requireInteraction: false,
    renotify: true
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
      .then(() => {
        console.log('[SW] 🎉 Notificación push mostrada')
      })
      .catch(err => {
        console.error('[SW] ❌ Error al mostrar notificación push:', err)
      })
  )
})