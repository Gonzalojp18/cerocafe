import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Dish from '@/models/Dish'
import Category from '@/models/Category'

// Multiplicador por defecto para precios take away
const TAKEAWAY_MULTIPLIER = 1.20 // +20%

// Función para calcular precio take away
const calculateTakeawayPrice = (dish: any) => {
    // Si tiene precio específico de takeaway, usar ese
    if (dish.takeawayPrice && dish.takeawayPrice > 0) {
        return dish.takeawayPrice
    }
    // Si no, aplicar multiplicador
    return Math.round(dish.precio * TAKEAWAY_MULTIPLIER)
}

export async function GET(request: Request) {
    try {
        await connectDB()

        // Obtener todas las categorías ordenadas
        const categories = await Category.find({}).sort({ orden: 1 }).lean()

        // Obtener todos los platos disponibles
        const dishes = await Dish.find({ disponible: true }).sort({ ventas: -1 })

        console.log('📊 Categorías encontradas:', categories.length)
        console.log('📊 Platos encontrados:', dishes.length)

        // 🔍 DEBUG: Ver qué trae cada categoría
        console.log('🔍 Templates de categorías:', categories.map(c => ({
            nombre: c.nombre,
            template: c.template,
            tieneTemplate: !!c.template
        })))

        if (!dishes || dishes.length === 0) {
            return NextResponse.json({
                recommended: [],
                categories: [],
                allDishes: [],
                priceInfo: {
                    multiplier: TAKEAWAY_MULTIPLIER,
                    description: `Precios take away incluyen ${Math.round((TAKEAWAY_MULTIPLIER - 1) * 100)}% adicional`
                },
                message: 'No hay platos disponibles en este momento'
            })
        }

        // Transformar platos con precios take away
        const transformDish = (dish: any) => ({
            _id: dish._id.toString(),
            name: dish.nombre,
            description: dish.descripcion || '',
            basePrice: dish.precio,
            price: calculateTakeawayPrice(dish),
            image: dish.imagen || null,
            category: dish.categoria,
            popularity: dish.ventas || 0
        })

        // Agrupar platos por categoría
        const dishesByCategory = categories.map(category => {
            const categoryData = {
                _id: category._id.toString(),
                name: category.nombre,
                description: category.descripcion || '',
                template: category.template || 'grid'
            }

            // 🔍 DEBUG: Ver cada categoría procesada
            console.log(`📦 Procesando categoría: ${category.nombre}`, {
                templateOriginal: category.template,
                templateFinal: categoryData.template
            })

            return {
                category: categoryData,
                dishes: dishes
                    .filter(dish => dish.categoria === category.nombre)
                    .map(transformDish)
            }
        }).filter(group => group.dishes.length > 0)

        // Obtener platos recomendados (los más vendidos)
        const recommended = dishes
            .map(transformDish)
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 6)

        // Todos los platos transformados
        const allDishes = dishes.map(transformDish)

        console.log('✅ Enviando datos:', {
            recommended: recommended.length,
            categories: dishesByCategory.length,
            allDishes: allDishes.length
        })

        // 🔍 DEBUG: Ver estructura final antes de enviar
        console.log('🔍 Categorías finales con templates:', dishesByCategory.map(c => ({
            nombre: c.category.name,
            template: c.category.template,
            platos: c.dishes.length
        })))

        return NextResponse.json({
            recommended,
            categories: dishesByCategory,
            allDishes,
            priceInfo: {
                multiplier: TAKEAWAY_MULTIPLIER,
                description: `Precios take away incluyen ${Math.round((TAKEAWAY_MULTIPLIER - 1) * 100)}% adicional`
            }
        })
    } catch (error) {
        console.error('❌ Error al obtener platos:', error)
        return NextResponse.json(
            {
                error: 'Error interno del servidor',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

export const dynamic = 'force-dynamic'