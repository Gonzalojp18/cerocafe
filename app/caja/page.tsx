'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Bell, ArrowLeft, Settings, History, ShoppingBag } from 'lucide-react'

type Transaction = {
  _id: string
  staffName: string
  staffRole: string
  points: number
  action: string
  previousBalance: number
  newBalance: number
  createdAt: string
}

type Order = {
  _id: string
  orderNumber: string
  customer: {
    name: string
    phone: string
  }
  deliveryType: string
  total: number
  status: string
  createdAt: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export default function CajaPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Estados de clientes
  const [dni, setDni] = useState('')
  const [cliente, setCliente] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [puntosInput, setPuntosInput] = useState('')
  const [procesando, setProcesando] = useState(false)
  const [enviandoNotificacion, setEnviandoNotificacion] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(false)

  // Estados de órdenes
  const [ordenes, setOrdenes] = useState<Order[]>([])
  const [loadingOrdenes, setLoadingOrdenes] = useState(false)
  const [filtroOrden, setFiltroOrden] = useState<string>('pending')
  const [vistaActual, setVistaActual] = useState<'puntos' | 'ordenes'>('puntos')

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

  // Cargar órdenes cuando cambia el filtro
  useEffect(() => {
    if (vistaActual === 'ordenes' && (session?.user?.role === 'staff' || session?.user?.role === 'owner')) {
      cargarOrdenes(filtroOrden)
    }
  }, [session, filtroOrden, vistaActual])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Cargando...</p>
      </div>
    )
  }

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
    setTransactions([])

    try {
      const response = await fetch(`/api/customers/search?dni=${dni}`, {
        cache: 'no-store'
      })
      const data = await response.json()

      if (response.ok) {
        setCliente(data.customer)
        await cargarHistorial(dni)
      } else {
        setError(data.error || 'Cliente no encontrado')
      }
    } catch (err) {
      console.error('❌ Error al buscar cliente:', err)
      setError('Error al buscar cliente')
    } finally {
      setLoading(false)
    }
  }

  const cargarHistorial = async (dniCliente: string) => {
    setLoadingTransactions(true)
    try {
      const response = await fetch(`/api/customers/transactions?dni=${dniCliente}`)
      const data = await response.json()

      if (response.ok) {
        setTransactions(data.transactions)
      }
    } catch (error) {
      console.error('Error al cargar historial:', error)
    } finally {
      setLoadingTransactions(false)
    }
  }

  const cargarOrdenes = async (status: string = 'pending') => {
    setLoadingOrdenes(true)
    try {
      const url = status === 'all'
        ? '/api/orders'
        : `/api/orders?status=${status}`

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setOrdenes(data.orders)
      }
    } catch (error) {
      console.error('Error al cargar órdenes:', error)
    } finally {
      setLoadingOrdenes(false)
    }
  }

  const actualizarEstadoOrden = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()

      if (data.success) {
        cargarOrdenes(filtroOrden)
        alert(`Orden actualizada a: ${newStatus}`)
      } else {
        alert('Error al actualizar orden')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar orden')
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
        await enviarNotificacionAutomatica(accion, puntos, nuevosPuntos)
        await cargarHistorial(cliente.dni)
        setPuntosInput('')
        alert(`Puntos ${accion === 'add' ? 'agregados' : 'restados'} exitosamente`)
      } else {
        alert(data.error || 'Error al gestionar puntos')
      }
    } catch (err) {
      console.error('❌ Error al procesar solicitud:', err)
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
          title: '👋 Mensaje desde Cero',
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

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      preparing: 'bg-purple-500',
      ready: 'bg-green-500',
      delivered: 'bg-gray-500',
      cancelled: 'bg-red-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
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

      <h1 className="text-3xl font-bold mb-2">Panel de Caja</h1>
      <p className="text-sm text-gray-500 mb-6">
        Usuario: {session?.user?.name} ({session?.user?.role})
      </p>

      {/* Tabs para alternar vistas */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setVistaActual('puntos')}
          className={`px-4 py-2 font-medium ${vistaActual === 'puntos'
            ? 'border-b-2 border-[#FB732F] text-[#FB732F]'
            : 'text-gray-500'
            }`}
        >
          Gestión de Puntos
        </button>
        <button
          onClick={() => setVistaActual('ordenes')}
          className={`px-4 py-2 font-medium ${vistaActual === 'ordenes'
            ? 'border-b-2 border-[#FB732F] text-[#FB732F]'
            : 'text-gray-500'
            }`}
        >
          <ShoppingBag className="h-4 w-4 inline mr-2" />
          Órdenes
        </button>
      </div>

      {/* VISTA: Gestión de Puntos */}
      {vistaActual === 'puntos' && (
        <>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card de gestión de puntos */}
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
                      <p className="text-2xl font-bold text-[#FB732F]">{cliente.points}</p>
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
                        className="bg-[#FB732F] hover:bg-[#FB732F]/90"
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

              {/* Card de historial */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Historial de Transacciones
                  </CardTitle>
                  <CardDescription>
                    Últimas {transactions.length} transacciones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingTransactions ? (
                    <p className="text-sm text-gray-500">Cargando historial...</p>
                  ) : transactions.length === 0 ? (
                    <p className="text-sm text-gray-500">No hay transacciones registradas</p>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {transactions.map((transaction) => (
                        <div
                          key={transaction._id}
                          className="border rounded-lg p-3 text-sm"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span
                                className={`font-semibold ${transaction.action === 'add'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                                  }`}
                              >
                                {transaction.action === 'add' ? '+' : '-'}
                                {transaction.points} puntos
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatearFecha(transaction.createdAt)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600">
                            <p>
                              Realizado por: <span className="font-medium">{transaction.staffName}</span> ({transaction.staffRole})
                            </p>
                            <p className="mt-1">
                              Saldo: {transaction.previousBalance} → {transaction.newBalance}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* VISTA: Órdenes */}
      {vistaActual === 'ordenes' && (
        <>
          {/* Filtros de órdenes */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFiltroOrden('all')}
              className={`px-4 py-2 rounded ${filtroOrden === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Todas
            </button>
            <button
              onClick={() => setFiltroOrden('pending')}
              className={`px-4 py-2 rounded ${filtroOrden === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFiltroOrden('confirmed')}
              className={`px-4 py-2 rounded ${filtroOrden === 'confirmed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Confirmadas
            </button>
            <button
              onClick={() => setFiltroOrden('preparing')}
              className={`px-4 py-2 rounded ${filtroOrden === 'preparing' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
            >
              En Preparación
            </button>
            <button
              onClick={() => setFiltroOrden('ready')}
              className={`px-4 py-2 rounded ${filtroOrden === 'ready' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            >
              Listas
            </button>
          </div>

          {/* Lista de órdenes */}
          {loadingOrdenes ? (
            <p>Cargando órdenes...</p>
          ) : ordenes.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No hay órdenes con el estado seleccionado
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {ordenes.map((orden) => (
                <Card key={orden._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{orden.orderNumber}</CardTitle>
                        <p className="text-sm text-gray-600">
                          {formatearFecha(orden.createdAt)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(orden.status)}>
                        {orden.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Cliente:</strong> {orden.customer.name}</p>
                      <p><strong>Teléfono:</strong> {orden.customer.phone}</p>
                      <p><strong>Tipo:</strong> {orden.deliveryType === 'delivery' ? 'Delivery' : 'Retiro'}</p>

                      <div className="mt-4">
                        <strong>Items:</strong>
                        <ul className="mt-2 space-y-1">
                          {orden.items.map((item, idx) => (
                            <li key={idx} className="text-sm">
                              {item.quantity}x {item.name} - ${item.price * item.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <p className="text-lg font-bold mt-4">Total: ${orden.total}</p>

                      {/* Botones de acciones */}
                      <div className="flex gap-2 mt-4 flex-wrap">
                        <Button
                          onClick={() => actualizarEstadoOrden(orden._id, 'confirmed')}
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Confirmar
                        </Button>
                        <Button
                          onClick={() => actualizarEstadoOrden(orden._id, 'preparing')}
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          Preparando
                        </Button>
                        <Button
                          onClick={() => actualizarEstadoOrden(orden._id, 'ready')}
                          size="sm"
                          className="bg-purple-500 hover:bg-purple-600"
                        >
                          Listo
                        </Button>
                        <Button
                          onClick={() => actualizarEstadoOrden(orden._id, 'delivered')}
                          size="sm"
                          variant="secondary"
                        >
                          Entregado
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}