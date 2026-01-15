import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

export async function GET(request: Request) {
    try {
        await connectDB()

        const session = await getServerSession(authOptions)

        // Verificar que el usuario esté autenticado
        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            )
        }

        // Obtener parámetros de la URL
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') // Filtrar por estado
        const limit = parseInt(searchParams.get('limit') || '50')

        // Construir el filtro
        const filter: any = {}
        if (status && status !== 'all') {
            filter.status = status
        }

        // Buscar órdenes (más recientes primero)
        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean()

        console.log(`✅ ${orders.length} órdenes encontradas`)

        return NextResponse.json({
            success: true,
            orders: orders.map(order => ({
                ...order,
                _id: order._id.toString()
            }))
        })

    } catch (error) {
        console.error('❌ Error al obtener órdenes:', error)
        return NextResponse.json(
            {
                error: 'Error interno del servidor',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}