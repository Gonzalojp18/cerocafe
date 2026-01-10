import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import clientPromise from '@/lib/mongodbClient'

export async function POST(request: Request) {
    try {
        const { name, dni, email, password, secretKey } = await request.json()

        // Clave secreta para proteger este endpoint
        if (secretKey !== process.env.OWNER_CREATION_SECRET) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            )
        }

        // Conectar a MongoDB
        const client = await clientPromise
        const db = client.db('cerocafe')
        const usersCollection = db.collection('users')

        // Verificar que no exista ya un owner
        const existingOwner = await usersCollection.findOne({ role: 'owner' })
        if (existingOwner) {
            return NextResponse.json(
                { error: 'Ya existe un usuario owner en el sistema' },
                { status: 400 }
            )
        }

        // Validaciones
        if (!name || !dni || !email || !password) {
            return NextResponse.json(
                { error: 'Todos los campos son requeridos' },
                { status: 400 }
            )
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10)

        // Crear owner
        const newOwner = {
            name,
            dni,
            email,
            password: hashedPassword,
            points: 0,
            role: 'owner',
            createdAt: new Date()
        }

        await usersCollection.insertOne(newOwner)

        return NextResponse.json(
            { message: 'Usuario owner creado exitosamente' },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error al crear owner:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}