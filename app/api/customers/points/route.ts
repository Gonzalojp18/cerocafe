import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import clientPromise from '@/lib/mongodbClient'

export async function POST(request: Request) {
    try {
        // Obtener sesión para saber quién hizo la operación
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            )
        }

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
        const db = client.db('cerocafe')
        const usersCollection = db.collection('users')
        const transactionsCollection = db.collection('points_transactions')

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
        console.log('🔄 Actualizando puntos en DB:', {
            dni,
            currentPoints,
            newPoints,
            action
        })

        const updateResult = await usersCollection.updateOne(
            { dni },
            { $set: { points: newPoints } }
        )

        console.log('✅ Resultado de actualización:', {
            matchedCount: updateResult.matchedCount,
            modifiedCount: updateResult.modifiedCount
        })

        // Verificar que se actualizó correctamente
        const updatedCustomer = await usersCollection.findOne({ dni })
        console.log('🔍 Usuario después de actualizar:', {
            dni: updatedCustomer?.dni,
            points: updatedCustomer?.points,
            pointsType: typeof updatedCustomer?.points
        })

        // Registrar la transacción
        const transaction = {
            userId: customer._id.toString(),
            customerId: customer._id,
            customerName: customer.name,
            customerDni: customer.dni,
            staffId: session.user.id,
            staffName: session.user.name,
            staffRole: session.user.role,
            points: points,
            action: action,
            previousBalance: currentPoints,
            newBalance: newPoints,
            createdAt: new Date()
        }

        await transactionsCollection.insertOne(transaction)

        console.log('💾 Transacción guardada exitosamente')

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