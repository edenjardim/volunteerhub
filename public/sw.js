// VolunteerHub Service Worker — Offline Support
const CACHE_NAME = 'volunteerhub-v1'
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/dashboard/schedules',
  '/dashboard/volunteers',
  '/dashboard/ministries',
  '/dashboard/events',
  '/dashboard/reports',
  '/manifest.json',
]

// Install — cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch — network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET and API calls
  if (request.method !== 'GET') return
  if (url.pathname.startsWith('/api/')) return

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
        }
        return response
      })
      .catch(() => caches.match(request))
  )
})

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  const title   = data.title   || 'VolunteerHub'
  const options = {
    body:  data.body  || 'Nova notificação',
    icon:  '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    data:  data.url || '/dashboard',
    actions: [
      { action: 'open',    title: 'Abrir App' },
      { action: 'dismiss', title: 'Dispensar'  },
    ],
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  if (event.action === 'dismiss') return
  const url = event.notification.data || '/dashboard'
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      const client = windowClients.find(c => c.url === url && 'focus' in c)
      if (client) return client.focus()
      return clients.openWindow(url)
    })
  )
})
