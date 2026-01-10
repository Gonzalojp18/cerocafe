import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import clientPromise from '@/lib/mongodbClient'

export async function POST(request: Request) {
    try {
        const { name, dni, email, password } = await request.json()

        // Validaciones básicas
        if (!name || !dni || !email || !password) {
            return NextResponse.json(
                { error: 'Todos los campos son requeridos' },
                { status: 400 }
            )
        }

        // Validar formato de DNI
        if (!/^\d{7,8}$/.test(dni)) {
            return NextResponse.json(
                { error: 'El DNI debe tener 7 u 8 dígitos' },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'La contraseña debe tener al menos 6 caracteres' },
                { status: 400 }
            )
        }

        // Conectar a MongoDB
        const client = await clientPromise
        const db = client.db('cerocafe')
        const usersCollection = db.collection('users')

        // Verificar si el email ya existe
        const existingEmail = await usersCollection.findOne({ email })
        if (existingEmail) {
            return NextResponse.json(
                { error: 'Este email ya está registrado' },
                { status: 400 }
            )
        }

        // Verificar si el DNI ya existe
        const existingDni = await usersCollection.findOne({ dni })
        if (existingDni) {
            return NextResponse.json(
                { error: 'Este DNI ya está registrado' },
                { status: 400 }
            )
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10)

        // Crear usuario
        const newUser = {
            name,
            dni,
            email,
            password: hashedPassword,
            points: 0,
            createdAt: new Date(),
            role: 'customer'
        }

        await usersCollection.insertOne(newUser)

        return NextResponse.json(
            { message: 'Usuario registrado exitosamente' },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error al registrar usuario:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}