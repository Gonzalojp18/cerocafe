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

        const client = await clientPromise
        const db = client.db('menu')
        const usersCollection = db.collection('users')

        // Validaciones
        if (!name || !dni || !email || !password) {
            return NextResponse.json(
                { error: 'Todos los campos son requeridos' },
                { status: 400 }
            )
        }

        // Verificar que no exista el email o DNI
        const existingUser = await usersCollection.findOne({
            $or: [{ email }, { dni }]
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Ya existe un usuario con ese email o DNI' },
                { status: 400 }
            )
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10)

        // Crear staff
        const newStaff = {
            name,
            dni,
            email,
            password: hashedPassword,
            points: 0,
            role: 'staff',
            createdAt: new Date()
        }

        await usersCollection.insertOne(newStaff)

        return NextResponse.json(
            { message: 'Usuario staff creado exitosamente' },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error al crear staff:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}