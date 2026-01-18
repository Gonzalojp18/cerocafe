'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Bell, ArrowLeft, Settings, History, ShoppingBag, Printer, Check } from 'lucide-react'

// Tipos
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
    address?: string
  }
  deliveryType: string
  total: number
  status: string
  createdAt: string
  paymentId?: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export default function CajaPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Estados compartidos
  const [activeTab, setActiveTab] = useState<'puntos' | 'ordenes'>('puntos')

  // Estados de Gestión de Puntos
  const [dni, setDni] = useState('')
  const [cliente, setCliente] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [puntosInput, setPuntosInput] = useState('')
  const [procesando, setProcesando] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(false)

  // Estados de Órdenes
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('paid_pending')
  const [processingOrders, setProcessingOrders] = useState<Set<string>>(new Set())

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

  // Cargar órdenes cuando se activa la pestaña
  useEffect(() => {
    if (activeTab === 'ordenes') {
      fetchOrders(filterStatus)

      // Auto-refresh cada 30 segundos
      const interval = setInterval(() => {
        fetchOrders(filterStatus)
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [activeTab, filterStatus])

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

  // ========== FUNCIONES DE GESTIÓN DE PUNTOS ==========

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
      const response = await fetch(`/api/customers/search?dni=${dni}`)
      const data = await response.json()

      if (response.ok) {
        setCliente(data.customer)
        await cargarHistorial(dni)
      } else {
        setError(data.error || 'Cliente no encontrado')
      }
    } catch (err) {
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
        await cargarHistorial(cliente.dni)
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

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // ========== FUNCIONES DE ÓRDENES ==========

  const fetchOrders = async (status: string = 'all') => {
    setLoadingOrders(true)
    try {
      const url = status === 'all'
        ? '/api/orders'
        : `/api/orders?status=${status}`

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Error al cargar órdenes:', error)
    } finally {
      setLoadingOrders(false)
    }
  }

  const confirmOrder = async (orderId: string) => {
    if (!confirm('¿Confirmar este pedido? Se imprimirá automáticamente.')) {
      return
    }

    setProcessingOrders(prev => new Set(prev).add(orderId))

    try {
      // 1. Imprimir pedido
      const printResponse = await fetch('/api/orders/print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      })

      if (!printResponse.ok) {
        throw new Error('Error al imprimir')
      }

      // 2. Actualizar estado
      const updateResponse = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed' })
      })

      const data = await updateResponse.json()

      if (data.success) {
        alert('✅ Pedido confirmado e impreso exitosamente')
        fetchOrders(filterStatus)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al confirmar pedido')
    } finally {
      setProcessingOrders(prev => {
        const newSet = new Set(prev)
        newSet.delete(orderId)
        return newSet
      })
    }
  }

  const printOrder = async (orderId: string) => {
    setProcessingOrders(prev => new Set(prev).add(orderId))

    try {
      const response = await fetch('/api/orders/print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      })

      if (response.ok) {
        alert('✅ Pedido enviado a impresora')
      }
    } catch (error) {
      alert('Error al imprimir')
    } finally {
      setProcessingOrders(prev => {
        const newSet = new Set(prev)
        newSet.delete(orderId)
        return newSet
      })
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()

      if (data.success) {
        fetchOrders(filterStatus)
        alert(`Orden actualizada a: ${newStatus}`)
      }
    } catch (error) {
      alert('Error al actualizar orden')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      paid_pending: { label: 'Pago Confirmado', color: 'bg-yellow-500' },
      confirmed: { label: 'En Preparación', color: 'bg-blue-500' },
      ready: { label: 'Listo', color: 'bg-green-500' },
      completed: { label: 'Completado', color: 'bg-gray-500' }
    }

    const config = statusConfig[status] || { label: status, color: 'bg-gray-400' }

    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
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

      {/* Pestañas */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('puntos')}
          className={`px-6 py-3 font-medium transition-colors ${activeTab === 'puntos'
            ? 'border-b-2 border-[#FB732F] text-[#FB732F]'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <History className="h-4 w-4 inline mr-2" />
          Gestión de Puntos
        </button>
        <button
          onClick={() => setActiveTab('ordenes')}
          className={`px-6 py-3 font-medium transition-colors ${activeTab === 'ordenes'
            ? 'border-b-2 border-[#FB732F] text-[#FB732F]'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <ShoppingBag className="h-4 w-4 inline mr-2" />
          Órdenes
          {orders.filter(o => o.status === 'paid_pending').length > 0 && (
            <Badge className="ml-2 bg-red-500">
              {orders.filter(o => o.status === 'paid_pending').length}
            </Badge>
          )}
        </button>
      </div>

      {/* CONTENIDO: GESTIÓN DE PUNTOS */}
      {activeTab === 'puntos' && (
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
                  </div>
                </CardContent>
              </Card>

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

      {/* CONTENIDO: ÓRDENES */}
      {activeTab === 'ordenes' && (
        <>
          {/* Filtros */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <Button
              onClick={() => setFilterStatus('all')}
              variant={filterStatus === 'all' ? 'default' : 'outline'}
            >
              Todas
            </Button>
            <Button
              onClick={() => setFilterStatus('paid_pending')}
              variant={filterStatus === 'paid_pending' ? 'default' : 'outline'}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              Pendientes ({orders.filter(o => o.status === 'paid_pending').length})
            </Button>
            <Button
              onClick={() => setFilterStatus('confirmed')}
              variant={filterStatus === 'confirmed' ? 'default' : 'outline'}
            >
              En Preparación
            </Button>
            <Button
              onClick={() => setFilterStatus('ready')}
              variant={filterStatus === 'ready' ? 'default' : 'outline'}
            >
              Listos
            </Button>
          </div>

          {/* Lista de órdenes */}
          {loadingOrders ? (
            <Card>
              <CardContent className="p-8 text-center">
                Cargando órdenes...
              </CardContent>
            </Card>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                No hay órdenes en este estado
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order._id} className={order.status === 'paid_pending' ? 'border-yellow-500 border-2' : ''}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">
                          {order.orderNumber}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleString('es-AR')}
                        </p>
                        {order.paymentId && (
                          <p className="text-xs text-gray-500 mt-1">
                            Pago ID: {order.paymentId}
                          </p>
                        )}
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Cliente:</strong> {order.customer.name}</p>
                      <p><strong>Teléfono:</strong> {order.customer.phone}</p>
                      {order.customer.address && (
                        <p><strong>Dirección:</strong> {order.customer.address}</p>
                      )}
                      <p><strong>Tipo:</strong> {order.deliveryType === 'delivery' ? 'Delivery' : 'Retiro'}</p>

                      <div className="mt-4">
                        <strong>Items:</strong>
                        <ul className="mt-2 space-y-1">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="text-sm">
                              {item.quantity}x {item.name} - ${item.price * item.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <p className="text-lg font-bold mt-4">
                        Total: ${order.total}
                      </p>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2 mt-6 flex-wrap">
                      {order.status === 'paid_pending' && (
                        <Button
                          onClick={() => confirmOrder(order._id)}
                          disabled={processingOrders.has(order._id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          {processingOrders.has(order._id) ? 'Procesando...' : 'Confirmar e Imprimir'}
                        </Button>
                      )}

                      <Button
                        onClick={() => printOrder(order._id)}
                        disabled={processingOrders.has(order._id)}
                        variant="outline"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Reimprimir
                      </Button>

                      {order.status === 'confirmed' && (
                        <Button
                          onClick={() => updateOrderStatus(order._id, 'ready')}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Marcar Listo
                        </Button>
                      )}

                      {order.status === 'ready' && (
                        <Button
                          onClick={() => updateOrderStatus(order._id, 'completed')}
                          className="bg-gray-600 hover:bg-gray-700"
                        >
                          Marcar Entregado
                        </Button>
                      )}
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