import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

export async function GET(request: Request) {
    try {
        await connectDB()

        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            )
        }

        const userId = session.user.id

        // Buscar órdenes del usuario actual
        const orders = await Order.find({ 'customer.userId': userId })
            .sort({ createdAt: -1 })
            .lean()

        console.log(`✅ ${orders.length} órdenes encontradas para usuario ${userId}`)

        return NextResponse.json({
            success: true,
            orders: orders.map(order => ({
                ...order,
                _id: order._id.toString()
            }))
        })

    } catch (error) {
        console.error('❌ Error al obtener órdenes del usuario:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}