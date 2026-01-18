'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Printer, Check } from 'lucide-react'

interface Order {
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

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState<string>('paid_pending')
    const [processingOrders, setProcessingOrders] = useState<Set<string>>(new Set())

    useEffect(() => {
        fetchOrders(filterStatus)

        // Auto-refresh cada 30 segundos
        const interval = setInterval(() => {
            fetchOrders(filterStatus)
        }, 30000)

        return () => clearInterval(interval)
    }, [filterStatus])

    const fetchOrders = async (status: string = 'all') => {
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
            setLoading(false)
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

            // 2. Actualizar estado a "confirmed"
            const updateResponse = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'confirmed' })
            })

            const data = await updateResponse.json()

            if (data.success) {
                alert('✅ Pedido confirmado e impreso exitosamente')
                fetchOrders(filterStatus)
            } else {
                alert('Error al actualizar pedido')
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
            } else {
                alert('Error al imprimir')
            }
        } catch (error) {
            console.error('Error:', error)
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
            } else {
                alert('Error al actualizar orden')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Error al actualizar orden')
        }
    }

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string; color: string }> = {
            paid_pending: { label: 'Pago Confirmado', color: 'bg-yellow-500' },
            confirmed: { label: 'En Preparación', color: 'bg-blue-500' },
            ready: { label: 'Listo', color: 'bg-green-500' },
            completed: { label: 'Completado', color: 'bg-gray-500' },
            cancelled: { label: 'Cancelado', color: 'bg-red-500' }
        }

        const config = statusConfig[status] || { label: status, color: 'bg-gray-400' }

        return (
            <Badge className={`${config.color} text-white`}>
                {config.label}
            </Badge>
        )
    }

    if (loading) {
        return <div className="p-8">Cargando órdenes...</div>
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Gestión de Pedidos</h1>

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
            {orders.length === 0 ? (
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
        </div>
    )
}