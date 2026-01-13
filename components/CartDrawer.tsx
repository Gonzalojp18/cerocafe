'use client'

import { useCart } from '@/app/contexts/CartContext'
import { X, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

interface CartDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, updateQuantity, removeItem, total, itemCount, pointsToEarn, clearCart } = useCart()

    if (!isOpen) return null

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Tu Pedido</h2>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Contenido del carrito */}
                {items.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Tu carrito está vacío</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-4">
                            {items.map(item => (
                                <Card key={item.dishId} className="overflow-hidden">
                                    <CardContent className="p-4">
                                        <div className="flex gap-4">
                                            <div className="relative w-20 h-20 bg-gray-100 rounded flex-shrink-0">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-2xl">🍽️</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-semibold">{item.name}</h3>
                                                <p className="text-[#FB732F] font-bold">${item.price}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => updateQuantity(item.dishId, item.quantity - 1)}
                                                >
                                                    -
                                                </Button>
                                                <span className="font-semibold w-8 text-center">{item.quantity}</span>
                                                <Button
                                                    size="sm"
                                                    onClick={() => updateQuantity(item.dishId, item.quantity + 1)}
                                                    className="bg-[#FB732F] hover:bg-[#FB732F]/90"
                                                >
                                                    +
                                                </Button>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeItem(item.dishId)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Resumen */}
                        <div className="border-t pt-4 mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span className="font-semibold">${total}</span>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>Puntos a ganar</span>
                                <span className="font-semibold text-[#FB732F]">
                                    +{pointsToEarn} pts
                                </span>
                            </div>
                        </div>

                        {/* Total y Checkout */}
                        <div className="border-t pt-4 mt-4">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xl font-bold">Total:</span>
                                <span className="text-2xl font-bold text-[#FB732F]">
                                    ${total}
                                </span>
                            </div>

                            <Link href="/takeaway/checkout">
                                <Button
                                    className="w-full bg-[#FB732F] hover:bg-[#FB732F]/90 py-6 text-lg"
                                    size="lg"
                                    onClick={onClose}
                                >
                                    Ir al Checkout
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}