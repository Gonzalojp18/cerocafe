import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import mongoose from 'mongoose';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

interface RouteParams {
    params: Promise<{
        id: string
    }>
}

export async function PATCH(request: Request, context: RouteParams) {
    try {
        await connectDB()
        console.log('🔌 DB Conectada:', mongoose.connection.name)

        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            )
        }

        const { id } = await context.params
        console.log('🔍 Buscando orden ID:', id)
        const { status } = await request.json()

        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Estado inválido' },
                { status: 400 }
            )
        }

        const order = await Order.findByIdAndUpdate(
            new mongoose.Types.ObjectId(id),
            { status },
            { new: true }
        )

        if (!order) {
            return NextResponse.json(
                { error: 'Orden no encontrada' },
                { status: 404 }
            )
        }

        console.log(`✅ Orden ${order.orderNumber} actualizada a: ${status}`)

        return NextResponse.json({
            success: true,
            order: {
                _id: order._id.toString(),
                orderNumber: order.orderNumber,
                status: order.status
            }
        })

    } catch (error) {
        console.error('❌ Error al actualizar orden:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}