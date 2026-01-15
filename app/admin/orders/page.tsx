'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'


interface Order {
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

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState<string>('all')

    useEffect(() => {
        fetchOrders(filterStatus)
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

    // botones en la interfaz para cambiar el estado de cada orden.
    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })

            const data = await response.json()

            if (data.success) {
                // Recargar las órdenes
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

    if (loading) {
        return <div className="p-8">Cargando órdenes...</div>
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Órdenes</h1>
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded ${filterStatus === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Todas
                </button>
                <button
                    onClick={() => setFilterStatus('pending')}
                    className={`px-4 py-2 rounded ${filterStatus === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                >
                    Pendientes
                </button>
                <button
                    onClick={() => setFilterStatus('confirmed')}
                    className={`px-4 py-2 rounded ${filterStatus === 'confirmed' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                >
                    Confirmadas
                </button>
            </div>

            {orders.length === 0 ? (
                <p className="text-gray-500">No hay órdenes todavía</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Card key={order._id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl">
                                            {order.orderNumber}
                                        </CardTitle>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleString('es-AR')}
                                        </p>
                                    </div>
                                    <Badge>{order.status}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p><strong>Cliente:</strong> {order.customer.name}</p>
                                    <p><strong>Teléfono:</strong> {order.customer.phone}</p>
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
                            </CardContent>
                            <div className="flex gap-2 mt-4 flex-wrap">
                                <button
                                    onClick={() => updateOrderStatus(order._id, 'confirmed')}
                                    className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                                >
                                    Confirmar
                                </button>
                                <button
                                    onClick={() => updateOrderStatus(order._id, 'preparing')}
                                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                                >
                                    Preparando
                                </button>
                                <button
                                    onClick={() => updateOrderStatus(order._id, 'ready')}
                                    className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
                                >
                                    Listo
                                </button>
                                <button
                                    onClick={() => updateOrderStatus(order._id, 'delivered')}
                                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                                >
                                    Entregado
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}