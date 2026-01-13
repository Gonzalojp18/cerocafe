'use client'

import { CATEGORY_TEMPLATES, TemplateType } from './templates'

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
        template?: TemplateType  // ← NUEVO: template de la categoría
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
            {categories.map(catGroup => {
                // Obtener el template de la categoría (fallback a 'grid')
                const templateType = catGroup.category.template || 'grid'
                const TemplateComponent = CATEGORY_TEMPLATES[templateType]

                return (
                    <div
                        key={catGroup.category._id}
                        id={`category-${catGroup.category.name}`}
                        className="scroll-mt-28"
                    >
                        {/* Header de categoría */}
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold mb-2">
                                {catGroup.category.name}
                            </h2>
                            {catGroup.category.description && (
                                <p className="text-gray-600">
                                    {catGroup.category.description}
                                </p>
                            )}
                        </div>

                        {/* Renderizar template dinámico */}
                        <TemplateComponent
                            dishes={catGroup.dishes}
                            onAddToCart={onAddToCart}
                        />
                    </div>
                )
            })}
        </div>
    )
}