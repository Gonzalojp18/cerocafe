'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Heart } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Dish } from '@/types/dish'

type CompactTemplateProps = {
    dishes: Dish[]
    onAddToCart: (dish: Dish) => void
}

export default function CompactTemplate({ dishes, onAddToCart }: CompactTemplateProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {dishes.map(dish => (
                <CompactDishCard
                    key={dish._id}
                    dish={dish}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    )
}

function CompactDishCard({ dish, onAddToCart }: { dish: Dish; onAddToCart: (dish: Dish) => void }) {
    const [isFavorite, setIsFavorite] = useState(false)

    return (
        <Card className="overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
            <CardContent className="p-0">
                {/* Imagen */}
                <div className="relative aspect-square bg-gray-800">
                    {dish.image ? (
                        <Image
                            src={dish.image}
                            alt={dish.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-5xl">🍽️</span>
                        </div>
                    )}

                    {/* Botón favorito */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsFavorite(!isFavorite)
                        }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors z-10"
                    >
                        <Heart
                            className={`h-4 w-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
                                }`}
                        />
                    </button>

                    {/* Badge de categoría (opcional) */}
                    <Badge className="absolute top-2 left-2 bg-[#FB732F] text-xs">
                        {dish.category}
                    </Badge>

                    {/* Botón agregar (aparece en hover) */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                            onClick={(e) => {
                                e.stopPropagation()
                                onAddToCart(dish)
                            }}
                            size="sm"
                            className="bg-[#FB732F] hover:bg-[#FB732F]/90 rounded-full w-10 h-10 p-0"
                        >
                            <Plus className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Info del plato */}
                <div className="p-3 space-y-1">
                    <h3 className="font-bold text-sm text-white line-clamp-1">
                        {dish.name}
                    </h3>

                    <p className="text-xs text-gray-400 line-clamp-1">
                        {dish.description}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                        <p className="text-lg font-bold text-[#FB732F]">
                            ${dish.price}
                        </p>

                        {/* Botón agregar visible siempre en móvil */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onAddToCart(dish)
                            }}
                            className="md:hidden w-8 h-8 rounded-full bg-[#FB732F] hover:bg-[#FB732F]/90 flex items-center justify-center transition-colors"
                        >
                            <Plus className="h-4 w-4 text-white" />
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}