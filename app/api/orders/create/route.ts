import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

// Función para generar número de orden único
const generateOrderNumber = async () => {
    const count = await Order.countDocuments()
    const orderNumber = `ORD-${String(count + 1).padStart(4, '0')}`
    return orderNumber
}

export async function POST(request: Request) {
    try {
        await connectDB()
        console.log('🔌 DB Conectada (Create Order):', mongoose.connection.name)

        const session = await getServerSession(authOptions)

        // Verificar que el usuario esté autenticado
        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'No autorizado. Debes iniciar sesión.' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { items, total, customer, deliveryType, address } = body

        // Validaciones básicas
        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'El carrito está vacío' },
                { status: 400 }
            )
        }

        if (!total || total <= 0) {
            return NextResponse.json(
                { error: 'Total inválido' },
                { status: 400 }
            )
        }

        if (!customer || !customer.name || !customer.phone) {
            return NextResponse.json(
                { error: 'Datos del cliente incompletos' },
                { status: 400 }
            )
        }

        if (!deliveryType || !['pickup', 'delivery'].includes(deliveryType)) {
            return NextResponse.json(
                { error: 'Tipo de entrega inválido' },
                { status: 400 }
            )
        }

        if (deliveryType === 'delivery' && !address) {
            return NextResponse.json(
                { error: 'Dirección requerida para delivery' },
                { status: 400 }
            )
        }

        // Generar número de orden
        const orderNumber = await generateOrderNumber()

        // Crear pedido
        const newOrder = new Order({
            orderNumber,
            items,
            total,
            customer: {
                userId: session.user.id,  // ID del usuario autenticado
                name: customer.name,
                phone: customer.phone,
                email: customer.email || session.user.email
            },
            deliveryType,
            address: deliveryType === 'delivery' ? address : undefined,
            status: 'pending',
            paymentStatus: 'pending'
        })

        await newOrder.save()

        console.log('✅ Pedido creado:', orderNumber)

        return NextResponse.json(
            {
                success: true,
                message: 'Pedido creado exitosamente',
                order: {
                    id: newOrder._id.toString(),
                    orderNumber: newOrder.orderNumber,
                    total: newOrder.total,
                    status: newOrder.status
                }
            },
            { status: 201 }
        )

    } catch (error) {
        console.error('❌ Error al crear pedido:', error)
        return NextResponse.json(
            {
                error: 'Error interno del servidor',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}