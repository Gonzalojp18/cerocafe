import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../[...nextauth]/route'
import clientPromise from '@/lib/mongodbClient'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('cerocafe')
    const usersCollection = db.collection('users')

    const user = await usersCollection.findOne({ _id: session.user.id })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      points: user.points || 0
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}