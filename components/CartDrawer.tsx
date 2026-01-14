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
                                        <div className="flex gap-3">
                                            {/* Imagen del producto */}
                                            <div className="relative w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                        <span className="text-2xl">🍽️</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Detalles y Controles */}
                                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
                                                        {item.name}
                                                    </h3>
                                                    <button
                                                        onClick={() => removeItem(item.dishId)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-2 -mt-2"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                <div className="flex items-end justify-between mt-2">
                                                    <p className="text-[#FB732F] font-bold text-sm">
                                                        ${item.price}
                                                    </p>

                                                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                                        <button
                                                            className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-[#FB732F] active:scale-95 transition-all disabled:opacity-50"
                                                            onClick={() => updateQuantity(item.dishId, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="font-semibold w-4 text-center text-sm">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            className="w-6 h-6 flex items-center justify-center bg-[#FB732F] text-white rounded shadow-sm hover:bg-[#FB732F]/90 active:scale-95 transition-all"
                                                            onClick={() => updateQuantity(item.dishId, item.quantity + 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
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