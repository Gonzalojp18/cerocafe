import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodbClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'owner' && session.user.role !== 'staff')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Ventas de los últimos 30 días
    const treintaDiasAtras = new Date();
    treintaDiasAtras.setDate(treintaDiasAtras.getDate() - 30);

    const ventasDiarias = await db.collection('sales').aggregate([
      { $match: { fecha: { $gte: treintaDiasAtras } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$fecha"
            }
          },
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } },
      {
        $project: {
          fecha: '$_id',
          total: 1,
          count: 1
        }
      }
    ]).toArray();

    // Ventas por categoría
    const ventasPorCategoria = await db.collection('sales').aggregate([
      {
        $lookup: {
          from: 'dishes',
          localField: 'dishId',
          foreignField: '_id',
          as: 'dish'
        }
      },
      { $unwind: '$dish' },
      {
        $group: {
          _id: '$dish.categoria',
          total: { $sum: '$total' },
          count: { $sum: '$cantidad' }
        }
      },
      {
        $project: {
          categoria: '$_id',
          total: 1,
          count: 1
        }
      }
    ]).toArray();

    // Platos más vendidos
    const platosMasVendidos = await db.collection('sales').aggregate([
      {
        $lookup: {
          from: 'dishes',
          localField: 'dishId',
          foreignField: '_id',
          as: 'dish'
        }
      },
      { $unwind: '$dish' },
      {
        $group: {
          _id: '$dishId',
          nombre: { $first: '$dish.nombre' },
          total: { $sum: '$total' },
          count: { $sum: '$cantidad' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();

    return NextResponse.json({
      ventasDiarias,
      ventasPorCategoria,
      platosMasVendidos
    });
  } catch (error) {
    console.error('Error al obtener analytics de ventas:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}