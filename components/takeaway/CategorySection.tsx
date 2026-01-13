'use client'

import DishCard from './DishCard'

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

type CategorySectionProps = {
    categories: CategoryGroup[]
    onAddToCart: (dish: Dish) => void
}

export default function CategorySection({ categories, onAddToCart }: CategorySectionProps) {
    if (categories.length === 0) return null

    return (
        <div className="space-y-12">
            {categories.map(catGroup => (
                <div key={catGroup.category._id}>
                    {/* Header de categoría */}
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold mb-2">{catGroup.category.name}</h2>
                        {catGroup.category.description && (
                            <p className="text-gray-600">{catGroup.category.description}</p>
                        )}
                    </div>

                    {/* Grid de platos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {catGroup.dishes.map(dish => (
                            <DishCard
                                key={dish._id}
                                dish={dish}
                                onAddToCart={onAddToCart}
                                variant="default"
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}