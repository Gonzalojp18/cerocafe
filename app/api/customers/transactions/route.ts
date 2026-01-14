import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodbClient'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const dni = searchParams.get('dni')

        if (!dni) {
            return NextResponse.json(
                { error: 'DNI es requerido' },
                { status: 400 }
            )
        }

        const client = await clientPromise
        const db = client.db('cerocafe')
        const usersCollection = db.collection('users')
        const transactionsCollection = db.collection('points_transactions')

        // Buscar el usuario por DNI
        const user = await usersCollection.findOne({ dni })

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        // Obtener transacciones del usuario, ordenadas por fecha descendente
        const transactions = await transactionsCollection
            .find({ userId: user._id.toString() })
            .sort({ createdAt: -1 })
            .limit(20)
            .toArray()

        return NextResponse.json({
            success: true,
            transactions: transactions.map(t => ({
                _id: t._id.toString(),
                staffName: t.staffName,
                staffRole: t.staffRole,
                points: t.points,
                action: t.action,
                previousBalance: t.previousBalance,
                newBalance: t.newBalance,
                createdAt: t.createdAt
            }))
        })

    } catch (error) {
        console.error('Error al obtener transacciones:', error)
        return NextResponse.json(
            { error: 'Error al obtener transacciones' },
            { status: 500 }
        )
    }
}