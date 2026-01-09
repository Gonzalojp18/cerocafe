'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, BellOff } from 'lucide-react'

export default function NotificationPermission() {
  const { data: session } = useSession()
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
      checkSubscription()
    }
  }, [session])

  const checkSubscription = async () => {
    if ('serviceWorker' in navigator && session?.user?.id) {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setIsSubscribed(!!subscription)
    }
  }

  const requestPermission = async () => {
    setLoading(true)
    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)

      if (permission === 'granted') {
        await subscribeUser()
      }
    } catch (error) {
      console.error('Error al solicitar permiso:', error)
      alert('Error al solicitar permiso de notificaciones')
    } finally {
      setLoading(false)
    }
  }

  const subscribeUser = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        )
      })

      // Guardar la suscripción en el backend
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription,
          userId: session?.user?.id
        })
      })

      if (response.ok) {
        setIsSubscribed(true)
        alert('¡Notificaciones activadas! Ahora recibirás actualizaciones sobre tus puntos.')
      }
    } catch (error) {
      console.error('Error al suscribirse:', error)
      alert('Error al activar notificaciones')
    }
  }

  const unsubscribe = async () => {
    setLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      
      if (subscription) {
        await subscription.unsubscribe()
        setIsSubscribed(false)
        alert('Notificaciones desactivadas')
      }
    } catch (error) {
      console.error('Error al desuscribirse:', error)
      alert('Error al desactivar notificaciones')
    } finally {
      setLoading(false)
    }
  }

  // Solo mostrar para customers
  if (session?.user?.role !== 'customer') {
    return null
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notificaciones
        </CardTitle>
        <CardDescription>
          Recibe notificaciones sobre tus puntos y promociones
        </CardDescription>
      </CardHeader>
      <CardContent>
        {permission === 'denied' ? (
          <div className="text-sm text-red-500">
            <p>Has bloqueado las notificaciones.</p>
            <p className="mt-2">Para activarlas, ve a la configuración de tu navegador.</p>
          </div>
        ) : isSubscribed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <Bell className="h-4 w-4" />
              <span className="text-sm font-medium">Notificaciones activas</span>
            </div>
            <Button 
              onClick={unsubscribe} 
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <BellOff className="h-4 w-4 mr-2" />
              Desactivar notificaciones
            </Button>
          </div>
        ) : (
          <Button 
            onClick={requestPermission} 
            disabled={loading}
            className="w-full"
          >
            <Bell className="h-4 w-4 mr-2" />
            {loading ? 'Activando...' : 'Activar notificaciones'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Función auxiliar para convertir la clave VAPID
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}