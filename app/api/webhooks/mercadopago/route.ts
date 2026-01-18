import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

// Inicializar cliente de MercadoPago
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!
})

export async function POST(request: Request) {
    try {
        const body = await request.json()

        console.log('🔔 Webhook recibido de MercadoPago:', body)

        // MercadoPago envía diferentes tipos de notificaciones
        // Solo nos interesan las de tipo "payment"
        if (body.type !== 'payment') {
            console.log('⏭️ Notificación ignorada, tipo:', body.type)
            return NextResponse.json({ received: true })
        }

        // Obtener ID del pago
        const paymentId = body.data?.id

        if (!paymentId) {
            console.log('⚠️ No se encontró payment ID')
            return NextResponse.json({ error: 'No payment ID' }, { status: 400 })
        }

        console.log('💳 Payment ID:', paymentId)

        // Consultar información del pago en MercadoPago
        const payment = new Payment(client)
        const paymentInfo = await payment.get({ id: paymentId })

        console.log('📄 Info del pago:', {
            id: paymentInfo.id,
            status: paymentInfo.status,
            status_detail: paymentInfo.status_detail,
            transaction_amount: paymentInfo.transaction_amount
        })

        // Solo procesar si el pago fue aprobado
        if (paymentInfo.status !== 'approved') {
            console.log('⏳ Pago no aprobado aún, status:', paymentInfo.status)
            return NextResponse.json({ received: true })
        }

        // Extraer metadata (datos del pedido)
        const metadata = paymentInfo.metadata as any

        if (!metadata || !metadata.items || !metadata.customer_data) {
            console.log('⚠️ Metadata incompleta')
            return NextResponse.json({ error: 'Incomplete metadata' }, { status: 400 })
        }

        // Parsear datos
        const items = JSON.parse(metadata.items)
        const customerData = JSON.parse(metadata.customer_data)
        const userId = metadata.user_id
        const total = metadata.total

        console.log('📦 Datos del pedido:', {
            items: items.length,
            customer: customerData.nombre,
            total
        })

        // Conectar a MongoDB
        await connectDB()

        // Verificar si ya existe un pedido con este payment_id
        const existingOrder = await Order.findOne({ paymentId: paymentId.toString() })

        if (existingOrder) {
            console.log('✅ Pedido ya existe:', existingOrder.orderNumber)
            return NextResponse.json({ received: true, order: existingOrder.orderNumber })
        }

        // Generar número de orden
        const count = await Order.countDocuments()
        const orderNumber = `ORD-${String(count + 1).padStart(4, '0')}`

        // Crear pedido en MongoDB
        const newOrder = new Order({
            orderNumber,
            items,
            total,
            customer: {
                userId,
                name: customerData.nombre,
                phone: customerData.telefono,
                email: customerData.email || ''
            },
            deliveryType: 'delivery',
            address: customerData.direccion || '',
            status: 'paid_pending',  // ← ESTADO INICIAL: Pagado pero pendiente de confirmación admin
            paymentStatus: 'approved',
            paymentId: paymentId.toString()
        })

        await newOrder.save()

        console.log('✅ Pedido creado exitosamente:', orderNumber)

        // TODO: Aquí enviar notificación al admin (próxima fase)

        return NextResponse.json({
            received: true,
            order: orderNumber,
            status: 'created'
        })

    } catch (error) {
        console.error('❌ Error en webhook:', error)
        return NextResponse.json(
            { error: 'Webhook error', details: error instanceof Error ? error.message : 'Unknown' },
            { status: 500 }
        )
    }
}

// Permitir que MercadoPago llame a este endpoint sin autenticación
export const dynamic = 'force-dynamic'