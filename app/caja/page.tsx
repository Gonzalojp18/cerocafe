'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bell, ArrowLeft, Settings } from 'lucide-react'

export default function CajaPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dni, setDni] = useState('')
  const [cliente, setCliente] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [puntosInput, setPuntosInput] = useState('')
  const [procesando, setProcesando] = useState(false)
  const [enviandoNotificacion, setEnviandoNotificacion] = useState(false)

  // Protección de ruta
  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session?.user?.role !== 'staff' && session?.user?.role !== 'owner') {
      router.push('/menu')
      return
    }
  }, [session, status, router])

  // Mostrar loading mientras verifica la sesión
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Cargando...</p>
      </div>
    )
  }

  // Si no es staff ni owner, no mostrar nada
  if (session?.user?.role !== 'staff' && session?.user?.role !== 'owner') {
    return null
  }

  const buscarCliente = async () => {
    if (!dni) {
      setError('Ingresa un DNI')
      return
    }

    setLoading(true)
    setError('')
    setCliente(null)

    try {
      const response = await fetch(`/api/customers/search?dni=${dni}`)
      const data = await response.json()

      if (response.ok) {
        setCliente(data.customer)
      } else {
        setError(data.error || 'Cliente no encontrado')
      }
    } catch (err) {
      setError('Error al buscar cliente')
    } finally {
      setLoading(false)
    }
  }

  const gestionarPuntos = async (accion: 'add' | 'subtract') => {
    const puntos = parseInt(puntosInput)

    if (!puntos || puntos <= 0) {
      alert('Ingresa una cantidad válida de puntos')
      return
    }

    setProcesando(true)

    try {
      const response = await fetch('/api/customers/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dni: cliente.dni,
          points: puntos,
          action: accion
        })
      })

      const data = await response.json()

      if (response.ok) {
        const nuevosPuntos = data.newPoints
        setCliente({ ...cliente, points: nuevosPuntos })

        // Enviar notificación automática
        await enviarNotificacionAutomatica(accion, puntos, nuevosPuntos)

        setPuntosInput('')
        alert(`Puntos ${accion === 'add' ? 'agregados' : 'restados'} exitosamente`)
      } else {
        alert(data.error || 'Error al gestionar puntos')
      }
    } catch (err) {
      alert('Error al procesar la solicitud')
    } finally {
      setProcesando(false)
    }
  }

  const enviarNotificacionAutomatica = async (accion: 'add' | 'subtract', puntos: number, nuevosPuntos: number) => {
    try {
      const title = accion === 'add' ? '🎉 ¡Puntos agregados!' : '📉 Puntos canjeados'
      const body = accion === 'add'
        ? `Se agregaron ${puntos} puntos. Total: ${nuevosPuntos} puntos`
        : `Se restaron ${puntos} puntos. Total: ${nuevosPuntos} puntos`

      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: cliente._id,
          title,
          body
        })
      })
    } catch (error) {
      console.error('Error al enviar notificación automática:', error)
      // No mostramos error al usuario, la notificación es opcional
    }
  }

  const enviarNotificacionManual = async () => {
    if (!cliente) return

    setEnviandoNotificacion(true)
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: cliente._id,
          title: '👋 Mensaje desde Juliette',
          body: `Hola ${cliente.name}, tienes ${cliente.points} puntos acumulados`
        })
      })

      if (response.ok) {
        alert('✅ Notificación enviada exitosamente')
      } else {
        const data = await response.json()
        alert(data.error || 'Error al enviar notificación')
      }
    } catch (error) {
      console.error('Error al enviar notificación manual:', error)
      alert('Error al enviar notificación')
    } finally {
      setEnviandoNotificacion(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Navigation */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Menú
          </Button>
        </Link>

        {session?.user?.role === 'owner' && (
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Panel de Admin
            </Button>
          </Link>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-6">Caja - Gestión de Puntos</h1>
      <p className="text-sm text-gray-500 mb-4">
        Usuario: {session?.user?.name} ({session?.user?.role})
      </p>

      {/* Buscador de cliente */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Buscar Cliente</CardTitle>
          <CardDescription>Ingresa el DNI del cliente para gestionar sus puntos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="DNI del cliente"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && buscarCliente()}
              className="flex-1"
            />
            <Button onClick={buscarCliente} disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </CardContent>
      </Card>

      {/* Información del cliente */}
      {cliente && (
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-semibold">{cliente.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">DNI</p>
                <p className="font-semibold">{cliente.dni}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">{cliente.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Puntos Acumulados</p>
                <p className="text-2xl font-bold text-green-600">{cliente.points}</p>
              </div>
            </div>

            {/* Gestión de puntos */}
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-semibold mb-3">Gestión de puntos</p>
              <div className="flex gap-3 mb-3">
                <Input
                  type="number"
                  placeholder="Cantidad de puntos"
                  value={puntosInput}
                  onChange={(e) => setPuntosInput(e.target.value)}
                  className="flex-1"
                  min="1"
                />
                <Button
                  onClick={() => gestionarPuntos('add')}
                  disabled={procesando}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Agregar
                </Button>
                <Button
                  onClick={() => gestionarPuntos('subtract')}
                  disabled={procesando}
                  variant="destructive"
                >
                  Restar
                </Button>
              </div>

              {/* Botón para enviar notificación manual */}
              <Button
                onClick={enviarNotificacionManual}
                disabled={enviandoNotificacion}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Bell className="h-4 w-4 mr-2" />
                {enviandoNotificacion ? 'Enviando...' : 'Enviar notificación de prueba'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}