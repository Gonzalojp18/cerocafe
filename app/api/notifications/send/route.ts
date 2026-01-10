import { NextResponse } from 'next/server'
import webpush from 'web-push'
import clientPromise from '@/lib/mongodbClient'

// Configurar web-push con las VAPID keys
if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.error('VAPID keys no encontradas en variables de entorno')
} else {
    webpush.setVapidDetails(
        'mailto:siriusweb256@gmail.com',
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    )
}

export async function POST(request: Request) {
    console.log('🚀 POST /api/notifications/send - Inicio')
    try {
        const body = await request.json()
        console.log('📦 Body de notificación recibido:', body)
        const { userId, title, body: content } = body

        if (!userId || !title || !content) {
            console.warn('⚠️ Parámetros faltantes:', { userId, title, content })
            return NextResponse.json(
                { error: 'userId, title y body son requeridos' },
                { status: 400 }
            )
        }

        const client = await clientPromise
        const db = client.db('cerocafe')
        const subscriptionsCollection = db.collection('push_subscriptions')

        console.log('🔍 Buscando suscripción para userId:', userId)
        // Buscar la suscripción del usuario
        const userSubscription = await subscriptionsCollection.findOne({ userId })

        if (!userSubscription) {
            console.warn('❌ Suscripción no encontrada para userId:', userId)
            return NextResponse.json(
                { error: 'Usuario no tiene suscripción a notificaciones' },
                { status: 404 }
            )
        }

        console.log('✅ Suscripción encontrada, enviando...')
        // Payload de la notificación
        const payload = JSON.stringify({
            title,
            body: content,
            icon: '/cero192.png',
            badge: '/cero192.png'
        })

        // Enviar la notificación
        await webpush.sendNotification(userSubscription.subscription, payload)
        console.log('✨ Notificación enviada exitosamente')

        return NextResponse.json(
            { message: 'Notificación enviada exitosamente' },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('❌ Error al enviar notificación:', error)

        // Si la suscripción expiró o es inválida, eliminarla
        if (error.statusCode === 410) {
            console.log('🗑️ Suscripción expirada, eliminando...')
            const client = await clientPromise
            const db = client.db('cerocafe')
            await db.collection('push_subscriptions').deleteOne({
                'subscription.endpoint': error.endpoint
            })
        }

        return NextResponse.json(
            { error: 'Error al enviar notificación' },
            { status: 500 }
        )
    }
}