'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ShoppingBag } from 'lucide-react'

interface Order {
    _id: string
    orderNumber: string
    customer: {
        name: string
        phone: string
    }
    deliveryType: string
    address?: string
    total: number
    status: string
    createdAt: string
    items: Array<{
        name: string
        quantity: number
        price: number
    }>
}

export default function MisPedidosPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'loading') return

        if (status === 'unauthenticated') {
            router.push('/login')
            return
        }

        fetchMyOrders()
    }, [status, router])

    const fetchMyOrders = async () => {
        try {
            const response = await fetch('/api/orders/my-orders')
            const data = await response.json()

            if (data.success) {
                setOrders(data.orders)
            }
        } catch (error) {
            console.error('Error al cargar pedidos:', error)
        } finally {
            setLoading(false)
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

    const getStatusText = (status: string) => {
        const statusMap: any = {
            pending: 'Pendiente',
            confirmed: 'Confirmado',
            preparing: 'En preparación',
            ready: 'Listo para retirar',
            delivered: 'Entregado',
            cancelled: 'Cancelado'
        }
        return statusMap[status] || status
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

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg">Cargando...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/takeaway">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex items-center gap-3 mb-8">
                    <ShoppingBag className="h-8 w-8 text-[#FB732F]" />
                    <h1 className="text-3xl font-bold">Mis Pedidos</h1>
                </div>

                {orders.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold mb-2">No tenés pedidos aún</h2>
                            <p className="text-gray-600 mb-6">
                                Hacé tu primer pedido en nuestro menú
                            </p>
                            <Link href="/takeaway">
                                <Button className="bg-[#FB732F] hover:bg-[#FB732F]/90">
                                    Ver Menú
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
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
                                                {formatearFecha(order.createdAt)}
                                            </p>
                                        </div>
                                        <Badge className={getStatusColor(order.status)}>
                                            {getStatusText(order.status)}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tipo de entrega:</span>
                                            <span className="font-medium">
                                                {order.deliveryType === 'delivery' ? 'Delivery' : 'Retiro en local'}
                                            </span>
                                        </div>

                                        {order.address && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Dirección:</span>
                                                <span className="font-medium">{order.address}</span>
                                            </div>
                                        )}

                                        <div className="border-t pt-3 mt-3">
                                            <p className="font-semibold mb-2">Items:</p>
                                            <ul className="space-y-1">
                                                {order.items.map((item, idx) => (
                                                    <li key={idx} className="text-sm flex justify-between">
                                                        <span>
                                                            {item.quantity}x {item.name}
                                                        </span>
                                                        <span className="font-semibold">
                                                            ${item.price * item.quantity}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="border-t pt-3 mt-3">
                                            <div className="flex justify-between text-lg font-bold">
                                                <span>Total:</span>
                                                <span className="text-[#FB732F]">${order.total}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}