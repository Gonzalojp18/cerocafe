import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'
import Order from '@/models/Order'

export async function POST(request: Request) {
    try {
        // Verificar que sea staff u owner
        const session = await getServerSession(authOptions)

        if (!session || (session.user.role !== 'staff' && session.user.role !== 'owner')) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            )
        }

        const { orderId } = await request.json()

        if (!orderId) {
            return NextResponse.json(
                { error: 'orderId es requerido' },
                { status: 400 }
            )
        }

        // Buscar la orden en la base de datos
        await connectDB()
        const order = await Order.findById(orderId)

        if (!order) {
            return NextResponse.json(
                { error: 'Orden no encontrada' },
                { status: 404 }
            )
        }

        // Enviar a la app de impresión (localhost:3001)
        try {
            const printResponse = await fetch('http://localhost:3001/print', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order })
            })

            const printData = await printResponse.json()

            if (printResponse.ok) {
                return NextResponse.json({
                    success: true,
                    message: 'Impresión enviada exitosamente',
                    data: printData
                })
            } else {
                throw new Error(printData.error || 'Error al imprimir')
            }
        } catch (printError: any) {
            console.error('❌ Error al conectar con servidor de impresión:', printError)

            // Si el servidor de impresión no está disponible
            return NextResponse.json(
                {
                    error: 'No se pudo conectar con el servidor de impresión. Asegúrate que la app de impresión esté corriendo.',
                    details: printError.message
                },
                { status: 503 }
            )
        }

    } catch (error) {
        console.error('Error al procesar impresión:', error)
        return NextResponse.json(
            { error: 'Error al procesar la impresión' },
            { status: 500 }
        )
    }
}