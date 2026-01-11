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
        const transactionsCollection = db.collection('points_transactions')

        // ===== RESUMEN GENERAL =====
        
        // Total de clientes
        const totalCustomers = await usersCollection.countDocuments({ role: 'customer' })
        
        // Total de puntos en circulación
        const pointsInCirculation = await usersCollection.aggregate([
            { $group: { _id: null, total: { $sum: '$points' } } }
        ]).toArray()
        
        // Total de puntos otorgados (todas las sumas)
        const pointsAdded = await transactionsCollection.aggregate([
            { $match: { action: 'add' } },
            { $group: { _id: null, total: { $sum: '$points' } } }
        ]).toArray()
        
        // Total de puntos canjeados (todas las restas)
        const pointsSubtracted = await transactionsCollection.aggregate([
            { $match: { action: 'subtract' } },
            { $group: { _id: null, total: { $sum: '$points' } } }
        ]).toArray()

        // ===== ACTIVIDAD RECIENTE =====
        
        const now = new Date()
        const todayStart = new Date(now.setHours(0, 0, 0, 0))
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

        // Puntos otorgados hoy
        const pointsToday = await transactionsCollection.aggregate([
            { $match: { action: 'add', createdAt: { $gte: todayStart } } },
            { $group: { _id: null, total: { $sum: '$points' } } }
        ]).toArray()

        // Puntos otorgados esta semana
        const pointsWeek = await transactionsCollection.aggregate([
            { $match: { action: 'add', createdAt: { $gte: weekStart } } },
            { $group: { _id: null, total: { $sum: '$points' } } }
        ]).toArray()

        // Puntos otorgados este mes
        const pointsMonth = await transactionsCollection.aggregate([
            { $match: { action: 'add', createdAt: { $gte: monthStart } } },
            { $group: { _id: null, total: { $sum: '$points' } } }
        ]).toArray()

        // Clientes activos (con transacciones en los últimos 30 días)
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        const activeCustomers = await transactionsCollection.distinct('customerId', {
            createdAt: { $gte: last30Days }
        })

        // ===== TOP CLIENTES =====
        
        // Top 10 con más puntos
        const topByPoints = await usersCollection
            .find({ role: 'customer' })
            .sort({ points: -1 })
            .limit(10)
            .project({ name: 1, dni: 1, email: 1, points: 1 })
            .toArray()

        // Top 10 con más transacciones
        const topByTransactions = await transactionsCollection.aggregate([
            { $group: { 
                _id: '$customerId', 
                customerName: { $first: '$customerName' },
                customerDni: { $first: '$customerDni' },
                totalTransactions: { $sum: 1 }
            }},
            { $sort: { totalTransactions: -1 } },
            { $limit: 10 }
        ]).toArray()

        // ===== ANÁLISIS DE STAFF =====
        
        // Transacciones por staff
        const statsByStaff = await transactionsCollection.aggregate([
            { $group: {
                _id: '$staffId',
                staffName: { $first: '$staffName' },
                staffRole: { $first: '$staffRole' },
                totalTransactions: { $sum: 1 },
                pointsAdded: {
                    $sum: {
                        $cond: [{ $eq: ['$action', 'add'] }, '$points', 0]
                    }
                },
                pointsSubtracted: {
                    $sum: {
                        $cond: [{ $eq: ['$action', 'subtract'] }, '$points', 0]
                    }
                }
            }},
            { $sort: { totalTransactions: -1 } }
        ]).toArray()

        // ===== CONSTRUIR RESPUESTA =====
        
        const stats = {
            general: {
                totalCustomers,
                pointsInCirculation: pointsInCirculation[0]?.total || 0,
                totalPointsAdded: pointsAdded[0]?.total || 0,
                totalPointsSubtracted: pointsSubtracted[0]?.total || 0
            },
            recent: {
                pointsToday: pointsToday[0]?.total || 0,
                pointsWeek: pointsWeek[0]?.total || 0,
                pointsMonth: pointsMonth[0]?.total || 0,
                activeCustomers: activeCustomers.length
            },
            topCustomers: {
                byPoints: topByPoints,
                byTransactions: topByTransactions
            },
            staff: statsByStaff
        }

        return NextResponse.json({ stats })
    } catch (error) {
        console.error('Error al obtener estadísticas:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}