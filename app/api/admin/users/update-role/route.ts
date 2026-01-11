import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import clientPromise from '@/lib/mongodbClient'
import { ObjectId } from 'mongodb'

export async function POST(request: Request) {
    try {
        // Verificar que sea owner
        const session = await getServerSession(authOptions)
        
        if (!session || session.user?.role !== 'owner') {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            )
        }

        const { userId, newRole } = await request.json()

        // Validaciones
        if (!userId || !newRole) {
            return NextResponse.json(
                { error: 'userId y newRole son requeridos' },
                { status: 400 }
            )
        }

        // Validar que el rol sea válido
        if (!['customer', 'staff', 'owner'].includes(newRole)) {
            return NextResponse.json(
                { error: 'Rol inválido' },
                { status: 400 }
            )
        }

        const client = await clientPromise
        const db = client.db('cerocafe')
        const usersCollection = db.collection('users')

        // Verificar que el usuario exista
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) })
        
        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        // No permitir que el owner se quite su propio rol de owner
        if (user._id.toString() === session.user.id && newRole !== 'owner') {
            return NextResponse.json(
                { error: 'No puedes cambiar tu propio rol de owner' },
                { status: 400 }
            )
        }

        // Actualizar el rol
        await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { role: newRole, updatedAt: new Date() } }
        )

        return NextResponse.json(
            { message: 'Rol actualizado exitosamente' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error al actualizar rol:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}