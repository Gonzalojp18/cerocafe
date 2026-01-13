'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/app/contexts/CartContext'
import { useSession } from 'next-auth/react'
import { ShoppingCart, Search, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import RecommendedCarousel from '@/components/takeaway/RecommendedCarousel'
import CategorySection from '@/components/takeaway/CategorySection'
import CategoryNav from '@/components/takeaway/CategoryNav'

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

    return (
        <>
            <AnimatePresence>
                {loading && <LoadingTransition />}
            </AnimatePresence>

            {/* Modal de Registro Forzado */}
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
                        {/* Saludo al Usuario */}
                        {session?.user?.name && (
                            <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
                                <h2 className="text-xl md:text-2xl font-medium text-gray-800">
                                    ¡Hola, <span className="text-[#FB732F] font-bold capitalize">{session.user.name}</span>!
                                </h2>
                            </div>
                        )}

                        {/* Buscador */}
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
                        {!searchQuery && (
                            <RecommendedCarousel
                                dishes={recommended}
                                onAddToCart={handleAddToCart}
                            />
                        )}

                        {/* Navegación de Categorías */}
                        {!searchQuery && (
                            <CategoryNav categories={filteredCategories} />
                        )}

                        {/* Categorías con platos */}
                        <CategorySection
                            categories={filteredCategories}
                            onAddToCart={handleAddToCart}
                        />

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