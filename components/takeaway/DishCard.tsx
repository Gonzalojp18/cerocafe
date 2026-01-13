'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
import Image from 'next/image'

type DishCardProps = {
    dish: {
        _id: string
        name: string
        description: string
        basePrice: number
        price: number
        image?: string
        category?: string
        popularity?: number
    }
    onAddToCart: (dish: any) => void
    variant?: 'recommended' | 'default' | 'minimal-compact'
}

export default function DishCard({ dish, onAddToCart, variant = 'default' }: DishCardProps) {
    const isRecommended = variant === 'recommended'
    const imageHeight = isRecommended ? 'h-48' : 'h-40'

    return (
        <Card className="hover:shadow-xl transition-all cursor-pointer overflow-hidden group">
            {/* Imagen */}
            <div className={`relative ${imageHeight} bg-gray-200`}>
                {dish.image ? (
                    <Image
                        src={dish.image}
                        alt={dish.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className={isRecommended ? 'text-4xl' : 'text-3xl'}>🍽️</span>
                    </div>
                )}

                {/* Badge de Popular solo en recomendados */}
                {isRecommended && (
                    <Badge className="absolute top-3 right-3 bg-[#FB732F]">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                    </Badge>
                )}
            </div>

            {/* Contenido */}
            <CardContent className="p-4">
                <h3 className={`font-bold mb-1 ${isRecommended ? 'text-lg' : 'text-base'}`}>
                    {dish.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {dish.description}
                </p>

                {/* Precio y botón */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className={`font-bold text-[#FB732F] ${isRecommended ? 'text-2xl' : 'text-xl'}`}>
                            ${dish.price}
                        </p>
                        {dish.basePrice !== dish.price && isRecommended && (
                            <p className="text-xs text-gray-400 line-through">
                                En mesa: ${dish.basePrice}
                            </p>
                        )}
                    </div>

                    <Button
                        onClick={() => onAddToCart(dish)}
                        size={isRecommended ? 'default' : 'sm'}
                        className="bg-[#FB732F] hover:bg-[#FB732F]/90"
                    >
                        Agregar
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}