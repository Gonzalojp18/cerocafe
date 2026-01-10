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

        // Conectar a MongoDB
        const client = await clientPromise
        const db = client.db('cerocafe')
        const usersCollection = db.collection('users')

        // Buscar cliente por DNI
        const customer = await usersCollection.findOne(
            { dni },
            { projection: { password: 0 } } // Excluir la contraseña
        )

        if (!customer) {
            return NextResponse.json(
                { error: 'Cliente no encontrado' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            customer: {
                _id: customer._id,
                name: customer.name,
                dni: customer.dni,
                email: customer.email,
                points: customer.points || 0,
                role: customer.role
            }
        })
    } catch (error) {
        console.error('Error al buscar cliente:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}