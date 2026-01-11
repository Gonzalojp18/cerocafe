import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import bcrypt from 'bcryptjs'
import clientPromise from '@/lib/mongodbClient'

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

        const { name, dni, email, password, role } = await request.json()

        // Validaciones
        if (!name || !dni || !email || !password || !role) {
            return NextResponse.json(
                { error: 'Todos los campos son requeridos' },
                { status: 400 }
            )
        }

        // Validar que el rol sea válido
        if (!['customer', 'staff', 'owner'].includes(role)) {
            return NextResponse.json(
                { error: 'Rol inválido' },
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
            role,
            createdAt: new Date()
        }

        await usersCollection.insertOne(newUser)

        return NextResponse.json(
            { message: 'Usuario creado exitosamente' },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error al crear usuario:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}