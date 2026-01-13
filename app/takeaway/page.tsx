'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/app/contexts/CartContext'
import { useSession } from 'next-auth/react'
import { ShoppingCart, Search, Star, Flame, LogIn } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import CartDrawer from '@/components/CartDrawer'
import { AnimatePresence } from 'framer-motion'
import LoadingTransition from '@/components/LoadingTransition'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import RegisterForm from '@/components/RegisterForm'
import Link from 'next/link'

type Dish = {
    _id: string
    name: string
    description: string
    basePrice: number
    price: number
    image?: string
    category: string
    popularity: number
}

type CategoryGroup = {
    category: {
        _id: string
        name: string
        description?: string
    }
    dishes: Dish[]
}

export default function TakeAwayPage() {
    const { data: session, status } = useSession()
    const { addItem, itemCount, total } = useCart()
    const [recommended, setRecommended] = useState<Dish[]>([])
    const [categories, setCategories] = useState<CategoryGroup[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [isCartOpen, setIsCartOpen] = useState(false)

    // Solo se debe mostrar el contenido si el usuario está autenticado y terminó de cargar
    const isPageContentVisible = status === 'authenticated' && !loading

    useEffect(() => {
        fetchDishes()
    }, [])

    const fetchDishes = async () => {
        try {
            const response = await fetch('/api/takeaway/dishes')
            const data = await response.json()

            if (response.ok) {
                setRecommended(data.recommended)
                setCategories(data.categories)
            }
        } catch (error) {
            console.error('Error al cargar platos:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = (dish: Dish) => {
        addItem({
            dishId: dish._id,
            name: dish.name,
            price: dish.price,
            image: dish.image
        })
    }

    const filteredCategories = categories.map(catGroup => ({
        ...catGroup,
        dishes: catGroup.dishes.filter(dish =>
            dish.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dish.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(catGroup => catGroup.dishes.length > 0)

    // if (loading) {
    //     return (
    //         <div className="flex items-center justify-center min-h-screen">
    //             <p className="text-lg">Cargando menú...</p>
    //         </div>
    //     )
    // }

    return (
        <>
            <AnimatePresence>
                {loading && <LoadingTransition />}
            </AnimatePresence>

            {/* Modal de Registro Forzado si no está logueado y no está cargando */}
            {!loading && status === 'unauthenticated' && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <Dialog open={true}>
                        <DialogContent className="max-w-md w-full sm:rounded-2xl border-none shadow-2xl bg-white/95 backdrop-blur-xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-center text-[#FB732F]">
                                    ¡Bienvenido a Cero!
                                </DialogTitle>
                                <DialogDescription className="text-center text-gray-500">
                                    Para realizar tu pedido take away, necesitamos que te registres o inicies sesión.
                                </DialogDescription>
                            </DialogHeader>

                            <RegisterForm
                                preventAutoLogin={true}
                                redirectOnSuccess="/login?callbackUrl=/takeaway"
                            />

                            <div className="mt-4 text-center border-t pt-4">
                                <p className="text-sm text-gray-500 mb-2">¿Ya tienes cuenta?</p>
                                <Link
                                    href="/login?callbackUrl=/takeaway"
                                    className="inline-flex items-center text-[#FB732F] hover:underline font-medium"
                                >
                                    <LogIn className="w-4 h-4 mr-2" />
                                    Iniciar Sesión
                                </Link>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            )}

            {isPageContentVisible && (
                <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                    {/* Header con carrito */}
                    <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
                        <div className="container mx-auto px-4 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-[#FB732F]">Cero Café</h1>
                                    <p className="text-sm text-gray-500">Take Away</p>
                                </div>

                                {/* Carrito flotante */}
                                <Button
                                    className="relative bg-[#FB732F] hover:bg-[#FB732F]/90"
                                    size="lg"
                                    onClick={() => setIsCartOpen(true)}
                                >
                                    <ShoppingCart className="h-5 w-5 mr-2" />
                                    <span className="font-semibold">${total}</span>
                                    {itemCount > 0 && (
                                        <Badge className="absolute -top-2 -right-2 bg-red-500">
                                            {itemCount}
                                        </Badge>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="container mx-auto px-4 py-8">
                        {/* Hero Section con búsqueda */}
                        <div className="mb-8">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    type="text"
                                    placeholder="Buscar platos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 py-6 text-lg"
                                />
                            </div>
                        </div>

                        {/* Carrusel de Recomendados */}
                        {!searchQuery && recommended.length > 0 && (
                            <div className="mb-12">
                                <div className="flex items-center gap-2 mb-4">
                                    <Flame className="h-6 w-6 text-[#FB732F]" />
                                    <h2 className="text-2xl font-bold">Recomendados del día</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {recommended.map(dish => (
                                        <Card key={dish._id} className="hover:shadow-xl transition-shadow cursor-pointer overflow-hidden group">
                                            <div className="relative h-48 bg-gray-200">
                                                {dish.image ? (
                                                    <Image
                                                        src={dish.image}
                                                        alt={dish.name}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-4xl">🍽️</span>
                                                    </div>
                                                )}
                                                <Badge className="absolute top-3 right-3 bg-[#FB732F]">
                                                    <Star className="h-3 w-3 mr-1" />
                                                    Popular
                                                </Badge>
                                            </div>

                                            <CardContent className="p-4">
                                                <h3 className="font-bold text-lg mb-1">{dish.name}</h3>
                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                    {dish.description}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-2xl font-bold text-[#FB732F]">
                                                            ${dish.price}
                                                        </p>
                                                        {dish.basePrice !== dish.price && (
                                                            <p className="text-xs text-gray-400 line-through">
                                                                En mesa: ${dish.basePrice}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <Button
                                                        onClick={() => handleAddToCart(dish)}
                                                        className="bg-[#FB732F] hover:bg-[#FB732F]/90"
                                                    >
                                                        Agregar
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Categorías con platos */}
                        <div className="space-y-12">
                            {filteredCategories.map(catGroup => (
                                <div key={catGroup.category._id}>
                                    <div className="mb-6">
                                        <h2 className="text-3xl font-bold mb-2">{catGroup.category.name}</h2>
                                        {catGroup.category.description && (
                                            <p className="text-gray-600">{catGroup.category.description}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {catGroup.dishes.map(dish => (
                                            <Card key={dish._id} className="hover:shadow-lg transition-shadow overflow-hidden group">
                                                <div className="relative h-40 bg-gray-100">
                                                    {dish.image ? (
                                                        <Image
                                                            src={dish.image}
                                                            alt={dish.name}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <span className="text-3xl">🍽️</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <CardContent className="p-4">
                                                    <h3 className="font-semibold text-lg mb-1">{dish.name}</h3>
                                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                        {dish.description}
                                                    </p>

                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xl font-bold text-[#FB732F]">
                                                                ${dish.price}
                                                            </p>
                                                        </div>

                                                        <Button
                                                            onClick={() => handleAddToCart(dish)}
                                                            size="sm"
                                                            className="bg-[#FB732F] hover:bg-[#FB732F]/90"
                                                        >
                                                            Agregar
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sin resultados */}
                        {searchQuery && filteredCategories.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-xl text-gray-500">
                                    No encontramos platos que coincidan con "{searchQuery}"
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Cart Drawer */}
                    <CartDrawer
                        isOpen={isCartOpen}
                        onClose={() => setIsCartOpen(false)}
                    />
                </div>
            )}
        </>
    )
}