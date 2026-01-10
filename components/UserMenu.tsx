'use client'

import { useSession, signOut } from 'next-auth/react'
import { User, LogOut, LogIn, Bell, BellOff } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function UserMenu() {
    const { data: session, status } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const [notificationsEnabled, setNotificationsEnabled] = useState(false)
    const [loadingNotifications, setLoadingNotifications] = useState(false)

    useEffect(() => {
        checkNotificationStatus()
    }, [session])

    const checkNotificationStatus = async () => {
        if ('Notification' in window && 'serviceWorker' in navigator && session?.user?.id) {
            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.getSubscription()
            setNotificationsEnabled(!!subscription && Notification.permission === 'granted')
        }
    }


    const toggleNotifications = async () => {
        setLoadingNotifications(true)
        try {
            if (notificationsEnabled) {
                // Desactivar notificaciones
                const registration = await navigator.serviceWorker.ready
                const subscription = await registration.pushManager.getSubscription()
                if (subscription) {
                    await subscription.unsubscribe()
                    setNotificationsEnabled(false)
                    alert('Notificaciones desactivadas')
                }
            } else {
                // Activar notificaciones
                console.log('🔍 Session completa:', session)
                console.log('🔍 User ID:', session?.user?.id)

                const permission = await Notification.requestPermission()

                if (permission === 'granted') {
                    const registration = await navigator.serviceWorker.ready

                    const subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(
                            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
                        )
                    })

                    console.log('🔍 Subscription creada:', subscription)

                    // Guardar la suscripción
                    const payload = {
                        subscription,
                        userId: session?.user?.id
                    }

                    console.log('🔍 Payload enviado:', payload)

                    const response = await fetch('/api/notifications/subscribe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    })

                    const data = await response.json()
                    console.log('🔍 Respuesta del servidor:', data)
                    console.log('🔍 Status de respuesta:', response.status)

                    if (response.ok) {
                        setNotificationsEnabled(true)
                        alert('¡Notificaciones activadas!')
                    } else {
                        alert('Error: ' + (data.error || 'No se pudo activar'))
                    }
                } else {
                    alert('Permiso de notificaciones denegado')
                }
            }
        } catch (error) {
            console.error('❌ Error con notificaciones:', error)
            alert('Error al gestionar notificaciones')
        } finally {
            setLoadingNotifications(false)
        }
    }


    if (status === 'loading') {
        return null
    }

    if (!session) {
        return (
            <Link
                href="/login"
                className="absolute top-4 right-4 md:top-6 md:right-16 flex items-center gap-2 px-4 py-2 bg-[#FB732F] text-white rounded-full text-sm hover:bg-[#FB732F]/90 transition-colors z-50"
            >
                <LogIn className="h-4 w-4" />
                Iniciar sesión
            </Link>
        )
    }

    return (
        <div className="absolute top-4 right-4 md:top-6 md:right-16 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-[#FB732F] text-white rounded-full text-sm hover:bg-[#FB732F]/90 transition-colors"
            >
                <User className="h-4 w-4" />
                <span className="hidden md:inline">{session.user.name}</span>
                <span className="font-bold">{session.user.points} pts</span>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <p className="font-semibold text-gray-900">{session.user.name}</p>
                            <p className="text-sm text-gray-600">{session.user.email}</p>
                            <p className="text-xs text-gray-500 mt-1">DNI: {session.user.dni || 'N/A'}</p>
                        </div>

                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Puntos acumulados</span>
                                <span className="text-2xl font-bold text-[#FB732F]">{session.user.points}</span>
                            </div>
                        </div>

                        {/* Notificaciones */}
                        {(
                            <div className="p-4 border-b border-gray-200">
                                <button
                                    onClick={toggleNotifications}
                                    disabled={loadingNotifications}
                                    className="w-full flex items-center justify-between text-left text-sm hover:bg-gray-50 transition-colors p-2 rounded"
                                >
                                    <div className="flex items-center gap-2">
                                        {notificationsEnabled ? (
                                            <Bell className="h-4 w-4 text-[#FB732F]" />
                                        ) : (
                                            <BellOff className="h-4 w-4 text-gray-400" />
                                        )}
                                        <span className="text-gray-700">Notificaciones</span>
                                    </div>
                                    <span className={`text-xs font-medium ${notificationsEnabled ? 'text-[#FB732F]' : 'text-gray-400'}`}>
                                        {loadingNotifications ? '...' : notificationsEnabled ? 'Activas' : 'Inactivas'}
                                    </span>
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                signOut({ callbackUrl: '/' })
                                setIsOpen(false)
                            }}
                            className="w-full p-4 flex items-center gap-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Cerrar sesión
                        </button>
                    </div>
                </>
            )}
        </div>
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