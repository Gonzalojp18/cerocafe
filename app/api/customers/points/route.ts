import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodbClient'

export async function POST(request: Request) {
    try {
        const { dni, points, action } = await request.json()

        // Validaciones
        if (!dni || !points || !action) {
            return NextResponse.json(
                { error: 'DNI, puntos y acción son requeridos' },
                { status: 400 }
            )
        }

        if (points <= 0) {
            return NextResponse.json(
                { error: 'La cantidad de puntos debe ser mayor a 0' },
                { status: 400 }
            )
        }

        if (action !== 'add' && action !== 'subtract') {
            return NextResponse.json(
                { error: 'Acción inválida' },
                { status: 400 }
            )
        }

        // Conectar a MongoDB
        const client = await clientPromise
        const db = client.db('menu')
        const usersCollection = db.collection('users')

        // Buscar el cliente
        const customer = await usersCollection.findOne({ dni })

        if (!customer) {
            return NextResponse.json(
                { error: 'Cliente no encontrado' },
                { status: 404 }
            )
        }

        // Calcular nuevos puntos
        const currentPoints = customer.points || 0
        let newPoints = currentPoints

        if (action === 'add') {
            newPoints = currentPoints + points
        } else if (action === 'subtract') {
            newPoints = currentPoints - points
            // No permitir puntos negativos
            if (newPoints < 0) {
                return NextResponse.json(
                    { error: 'No hay suficientes puntos para restar' },
                    { status: 400 }
                )
            }
        }

        // Actualizar puntos en la base de datos
        await usersCollection.updateOne(
            { dni },
            { $set: { points: newPoints } }
        )

        return NextResponse.json({
            message: 'Puntos actualizados exitosamente',
            newPoints,
            previousPoints: currentPoints
        })
    } catch (error) {
        console.error('Error al gestionar puntos:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}