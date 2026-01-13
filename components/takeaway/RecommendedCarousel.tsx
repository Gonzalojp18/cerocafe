'use client'

import { Flame } from 'lucide-react'
import { motion } from 'framer-motion'
import DishCard from './DishCard'

type Dish = {
    _id: string
    name: string
    description: string
    basePrice: number
    price: number
    image?: string
    popularity: number
}

type RecommendedCarouselProps = {
    dishes: Dish[]
    onAddToCart: (dish: Dish) => void
}

export default function RecommendedCarousel({ dishes, onAddToCart }: RecommendedCarouselProps) {
    if (dishes.length === 0) return null

    return (
        <section className="py-8 w-full overflow-hidden bg-white">
            {/* Header con tipografía minimalista */}
            <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-full">
                        <Flame className="h-5 w-5 text-[#FB732F]" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-light tracking-tight text-neutral-800">
                        Selección <span className="font-bold text-black">del chef</span>
                    </h2>
                </div>

                {/* Indicador de scroll sutil para desktop */}
                <div className="hidden md:block text-xs uppercase tracking-widest text-neutral-400 font-medium">
                    Desliza para explorar →
                </div>
            </div>

            {/* Carousel Container: Scroll Horizontal Invisible */}
            <div className="relative">
                <div
                    className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide gap-5 px-6 pb-10"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {dishes.map((dish, index) => (
                        <motion.div
                            key={dish._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="flex-none w-[280px] md:w-[320px] snap-center"
                        >
                            <DishCard
                                dish={dish}
                                onAddToCart={onAddToCart}
                                variant="minimal-compact"
                            />
                        </motion.div>
                    ))}
                    {/* Espaciador final para el padding derecho */}
                    <div className="flex-none w-1 h-full pr-6" />
                </div>
            </div>
        </section>
    )
}