import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import clientPromise from '@/lib/mongodbClient'

export async function GET(request: Request) {
    try {
        // Verificar que sea owner
        const session = await getServerSession(authOptions)
        
        if (!session || session.user?.role !== 'owner') {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            )
        }

        const client = await clientPromise
        const db = client.db('cerocafe')
        const usersCollection = db.collection('users')

        // Obtener todos los usuarios (sin contraseñas)
        const users = await usersCollection
            .find({}, { projection: { password: 0 } })
            .sort({ createdAt: -1 })
            .toArray()

        return NextResponse.json({ users })
    } catch (error) {
        console.error('Error al obtener usuarios:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}