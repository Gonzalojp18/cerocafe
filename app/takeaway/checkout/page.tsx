'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/contexts/CartContext'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, ShoppingBag, Award } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
    const router = useRouter()
    const { items, total, pointsToEarn, clearCart } = useCart()
    const { data: session } = useSession()

    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        direccion: '',
        notas: ''
    })
    const [procesando, setProcesando] = useState(false)

    // Si no hay items, redirigir
    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
                <p className="text-gray-600 mb-6">Agregá productos para continuar</p>
                <Link href="/takeaway">
                    <Button className="bg-[#FB732F] hover:bg-[#FB732F]/90">
                        Ver Menú
                    </Button>
                </Link>
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setProcesando(true)

        try {
            // Aquí irá la lógica de crear el pedido
            console.log('Pedido:', {
                items,
                total,
                formData,
                userId: session?.user?.id
            })

            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 1500))

            alert('¡Pedido realizado exitosamente!')
            clearCart()
            router.push('/takeaway')
        } catch (error) {
            console.error('Error al procesar pedido:', error)
            alert('Error al procesar el pedido')
        } finally {
            setProcesando(false)
        }
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
                <h1 className="text-3xl font-bold mb-8">Finalizar Pedido</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formulario */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Datos de Entrega</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium">Nombre completo</label>
                                        <Input
                                            type="text"
                                            value={formData.nombre}
                                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                            required
                                            placeholder="Juan Pérez"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Teléfono</label>
                                        <Input
                                            type="tel"
                                            value={formData.telefono}
                                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                            required
                                            placeholder="11 1234-5678"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Dirección de entrega</label>
                                        <Input
                                            type="text"
                                            value={formData.direccion}
                                            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                            required
                                            placeholder="Calle 123, Piso 4"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Notas (opcional)</label>
                                        <textarea
                                            value={formData.notas}
                                            onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                                            placeholder="Instrucciones especiales..."
                                            className="w-full px-3 py-2 border rounded-md"
                                            rows={3}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={procesando}
                                        className="w-full bg-[#FB732F] hover:bg-[#FB732F]/90 py-6 text-lg"
                                    >
                                        {procesando ? 'Procesando...' : `Confirmar Pedido - $${total}`}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Resumen del pedido */}
                    <div>
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Resumen del Pedido</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {items.map(item => (
                                        <div key={item.dishId} className="flex justify-between text-sm">
                                            <span>
                                                {item.quantity}x {item.name}
                                            </span>
                                            <span className="font-semibold">
                                                ${item.price * item.quantity}
                                            </span>
                                        </div>
                                    ))}

                                    <div className="border-t pt-3 mt-3">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total:</span>
                                            <span className="text-[#FB732F]">${total}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Info de puntos */}
                        <Card className="bg-gradient-to-r from-[#FB732F]/10 to-orange-100">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <Award className="h-6 w-6 text-[#FB732F]" />
                                    <h3 className="font-bold text-lg">¡Ganá Puntos!</h3>
                                </div>
                                <p className="text-gray-700 mb-2">
                                    Con esta compra vas a ganar:
                                </p>
                                <p className="text-3xl font-bold text-[#FB732F]">
                                    +{pointsToEarn} puntos
                                </p>
                                {!session && (
                                    <p className="text-sm text-gray-600 mt-3">
                                        <Link href="/login" className="text-[#FB732F] underline">
                                            Iniciá sesión
                                        </Link>
                                        {' '}para acumular y usar tus puntos
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}