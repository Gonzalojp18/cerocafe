'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Dish = {
    _id: string
    name: string
    description: string
    price: number
    image?: string
}

interface GridTemplateProps {
    dishes: Dish[]
    onAddToCart: (dish: Dish) => void
}

export default function GridTemplate({ dishes, onAddToCart }: GridTemplateProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dishes.map((dish, index) => (
                <motion.div
                    key={dish._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                >
                    {/* Imagen */}
                    {dish.image && (
                        <div className="relative h-48 w-full bg-gray-100">
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
                        <h3 className="font-bold text-lg mb-2 line-clamp-1">
                            {dish.name}
                        </h3>

                        {dish.description && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {dish.description}
                            </p>
                        )}

                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-[#FB732F]">
                                ${dish.price}
                            </span>

                            <Button
                                onClick={() => onAddToCart(dish)}
                                size="sm"
                                className="bg-[#FB732F] hover:bg-[#FB732F]/90"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Agregar
                            </Button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}