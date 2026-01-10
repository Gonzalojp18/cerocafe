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

    // Top clientes por actividad
    const clientesTop = await db.collection('customeractivities').aggregate([
      {
        $group: {
          _id: '$clienteId',
          visitas: { $sum: 1 },
          ultimaVisita: { $max: '$fecha' }
        }
      },
      { $sort: { visitas: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'sales',
          let: { clienteId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$clienteId', '$$clienteId'] } } },
            {
              $group: {
                _id: '$clienteId',
                pedidos: { $sum: 1 },
                totalGastado: { $sum: '$total' }
              }
            }
          ],
          as: 'sales'
        }
      },
      {
        $project: {
          clienteId: '$_id',
          visitas: 1,
          ultimaVisita: 1,
          pedidos: { $ifNull: [{ $arrayElemAt: ['$sales.pedidos', 0] }, 0] },
          totalGastado: { $ifNull: [{ $arrayElemAt: ['$sales.totalGastado', 0] }, 0] }
        }
      }
    ]).toArray();

    // Patrones de visitas por hora (últimos 7 días)
    const sieteDiasAtras = new Date();
    sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 7);

    const patronesVisitas = await db.collection('customeractivities').aggregate([
      { $match: { fecha: { $gte: sieteDiasAtras }, accion: 'visita' } },
      {
        $group: {
          _id: { $hour: '$fecha' },
          visitas: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } },
      {
        $project: {
          hora: { $concat: [{ $toString: '$_id' }, ':00'] },
          visitas: 1
        }
      }
    ]).toArray();

    // Actividad reciente
    const actividadReciente = await db.collection('customeractivities')
      .find({})
      .sort({ fecha: -1 })
      .limit(50)
      .toArray();

    // Estadísticas generales
    const stats = await db.collection('customeractivities').aggregate([
      {
        $group: {
          _id: null,
          totalVisitas: { $sum: 1 },
          clientesUnicos: { $addToSet: '$clienteId' }
        }
      },
      {
        $project: {
          totalVisitas: 1,
          clientesUnicos: { $size: '$clientesUnicos' }
        }
      }
    ]).toArray();

    return NextResponse.json({
      clientesTop,
      patronesVisitas,
      actividadReciente: actividadReciente.map(activity => ({
        ...activity,
        _id: activity._id.toString(),
        fecha: activity.fecha.toISOString()
      })),
      stats: stats[0] || { totalVisitas: 0, clientesUnicos: 0 }
    });
  } catch (error) {
    console.error('Error al obtener analytics de clientes:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}