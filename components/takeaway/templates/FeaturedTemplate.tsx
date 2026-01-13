'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Plus, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type Dish = {
    _id: string
    name: string
    description: string
    price: number
    image?: string
    popularity?: number
}

interface FeaturedTemplateProps {
    dishes: Dish[]
    onAddToCart: (dish: Dish) => void
}

export default function FeaturedTemplate({ dishes, onAddToCart }: FeaturedTemplateProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {dishes.map((dish, index) => (
                <motion.div
                    key={dish._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.15 }}
                    className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border-2 border-orange-100"
                >
                    <div className="flex flex-col md:flex-row">
                        {/* Imagen */}
                        {dish.image && (
                            <div className="relative h-64 md:h-auto md:w-1/2 bg-gray-100">
                                <Image
                                    src={dish.image}
                                    alt={dish.name}
                                    fill
                                    className="object-cover"
                                />

                                {/* Badge de popularidad */}
                                {dish.popularity && dish.popularity > 50 && (
                                    <Badge className="absolute top-4 right-4 bg-[#FB732F] text-white">
                                        <Star className="h-3 w-3 mr-1 fill-current" />
                                        Popular
                                    </Badge>
                                )}
                            </div>
                        )}

                        {/* Contenido */}
                        <div className="p-6 md:w-1/2 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-2xl mb-3 text-gray-800">
                                    {dish.name}
                                </h3>

                                {dish.description && (
                                    <p className="text-gray-600 text-base mb-4 leading-relaxed">
                                        {dish.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Precio</p>
                                        <span className="text-3xl font-bold text-[#FB732F]">
                                            ${dish.price}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => onAddToCart(dish)}
                                    size="lg"
                                    className="w-full bg-[#FB732F] hover:bg-[#FB732F]/90 text-lg py-6"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Agregar al Pedido
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}