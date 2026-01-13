'use client'

import {
    Coffee,
    Pizza,
    UtensilsCrossed,
    IceCream,
    Sandwich,
    Salad,
    Beer,
    CakeSlice,
    Croissant
} from 'lucide-react'
import { motion } from 'framer-motion'

type CategoryNavProps = {
    categories: {
        category: {
            _id: string
            name: string
        }
    }[]
}

const getCategoryIcon = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('empanada')) return Croissant
    if (lowerName.includes('pizza')) return Pizza
    if (lowerName.includes('bebida') || lowerName.includes('jugo') || lowerName.includes('cafe')) return Coffee
    if (lowerName.includes('postre') || lowerName.includes('dulce')) return IceCream
    if (lowerName.includes('sandwich') || lowerName.includes('hamburguesa')) return Sandwich
    if (lowerName.includes('ensalada')) return Salad
    if (lowerName.includes('cerveza') || lowerName.includes('trago')) return Beer
    if (lowerName.includes('torta') || lowerName.includes('pastel')) return CakeSlice

    return UtensilsCrossed
}

export default function CategoryNav({ categories }: CategoryNavProps) {
    if (categories.length === 0) return null

    const scrollToCategory = (catName: string) => {
        const element = document.getElementById(`category-${catName}`)
        if (element) {
            // Offset para el header sticky
            const y = element.getBoundingClientRect().top + window.scrollY - 100
            window.scrollTo({ top: y, behavior: 'smooth' })
        }
    }

    return (
        <div className="sticky top-[80px] z-40 bg-white/95 backdrop-blur-sm border-b py-4 mb-8 shadow-sm">
            <div className="container mx-auto">
                <div
                    className="flex overflow-x-auto gap-4 px-4 pb-2 scrollbar-hide snap-x"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {categories.map((catGroup, index) => {
                        const Icon = getCategoryIcon(catGroup.category.name)

                        return (
                            <motion.button
                                key={catGroup.category._id}
                                onClick={() => scrollToCategory(catGroup.category.name)}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex-none flex flex-col items-center gap-2 group snap-start"
                            >
                                <div className="w-16 h-16 rounded-full bg-orange-50 border-2 border-transparent group-hover:border-[#FB732F] group-hover:bg-orange-100 transition-all flex items-center justify-center">
                                    <Icon className="w-7 h-7 text-[#FB732F] group-hover:scale-110 transition-transform" />
                                </div>
                                <span className="text-xs font-semibold text-gray-600 group-hover:text-[#FB732F] whitespace-nowrap">
                                    {catGroup.category.name}
                                </span>
                            </motion.button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
