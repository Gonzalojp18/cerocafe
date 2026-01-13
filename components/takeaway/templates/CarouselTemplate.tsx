'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'

type Dish = {
    _id: string
    name: string
    description: string
    price: number
    image?: string
}

interface CarouselTemplateProps {
    dishes: Dish[]
    onAddToCart: (dish: Dish) => void
}

export default function CarouselTemplate({ dishes, onAddToCart }: CarouselTemplateProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    return (
        <div className="relative">
            {/* Scroll horizontal */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {dishes.map((dish, index) => (
                    <motion.div
                        key={dish._id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex-shrink-0 w-64 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow snap-start"
                    >
                        {/* Imagen */}
                        {dish.image && (
                            <div className="relative h-40 w-full bg-gray-100 rounded-t-xl overflow-hidden">
                                <Image
                                    src={dish.image}
                                    alt={dish.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        {/* Contenido */}
                        <div className="p-4">
                            <h3 className="font-bold text-base mb-1 line-clamp-1">
                                {dish.name}
                            </h3>

                            {dish.description && (
                                <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                                    {dish.description}
                                </p>
                            )}

                            <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-[#FB732F]">
                                    ${dish.price}
                                </span>

                                <Button
                                    onClick={() => onAddToCart(dish)}
                                    size="sm"
                                    className="bg-[#FB732F] hover:bg-[#FB732F]/90"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Indicador de scroll */}
            <div className="mt-2 text-center text-xs text-gray-400">
                ← Desliza para ver más →
            </div>
        </div>
    )
}