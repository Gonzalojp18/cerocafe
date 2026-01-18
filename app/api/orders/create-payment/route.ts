import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Inicializar MercadoPago con el token correcto
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!
})

export async function POST(request: Request) {
    try {
        // Verificar autenticación
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { items, total, customerData } = body

        console.log('📦 Creando preferencia de pago:', {
            items: items.length,
            total,
            customer: customerData.nombre
        })

        // Validaciones
        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'El carrito está vacío' },
                { status: 400 }
            )
        }

        if (!customerData || !customerData.nombre || !customerData.telefono) {
            return NextResponse.json(
                { error: 'Datos del cliente incompletos' },
                { status: 400 }
            )
        }

        // Crear items para MercadoPago
        const mpItems = items.map((item: any) => ({
            title: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            currency_id: 'ARS'
        }))

        // URLs de retorno según entorno
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

        // Crear preferencia de pago
        const preference = new Preference(client)

        const result = await preference.create({
            body: {
                items: mpItems,
                payer: {
                    name: customerData.nombre,
                    email: session.user.email || customerData.email || 'pgonzalojose@gmail.com',
                    phone: {
                        number: customerData.telefono
                    }
                },
                back_urls: {
                    success: `${baseUrl}/takeaway/order-success`,
                    failure: `${baseUrl}/takeaway/order-failure`,
                    pending: `${baseUrl}/takeaway/order-pending`
                },
                // auto_return: 'approved',
                notification_url: `${baseUrl}/api/webhooks/mercadopago`,
                metadata: {
                    userId: session.user.id,
                    customerData: JSON.stringify(customerData),
                    items: JSON.stringify(items),
                    total: total
                }
            }
        })

        console.log('✅ Preferencia creada:', result.id)

        return NextResponse.json({
            init_point: result.init_point, // URL para redirigir
            preference_id: result.id
        })

    } catch (error) {
        console.error('❌ Error al crear preferencia de MP:', error)
        return NextResponse.json(
            { error: 'Error al procesar el pago', details: error instanceof Error ? error.message : 'Unknown' },
            { status: 500 }
        )
    }
}