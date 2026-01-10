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

    // Ventas totales
    const totalVentas = await db.collection('sales').aggregate([
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
    ]).toArray();

    // Platos más vendidos
    const platosPopulares = await db.collection('sales').aggregate([
      { $group: { _id: '$dishId', totalVentas: { $sum: '$cantidad' } } },
      { $sort: { totalVentas: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'dishes',
          localField: '_id',
          foreignField: '_id',
          as: 'plato'
        }
      },
      { $unwind: '$plato' },
      {
        $project: {
          nombre: '$plato.nombre',
          totalVentas: 1
        }
      }
    ]).toArray();

    // Inventario bajo
    const inventarioBajo = await db.collection('dishes').find({
      $expr: { $lte: ['$inventario', '$stockMinimo'] }
    }).toArray();

    // Ventas últimos 7 días
    const sieteDiasAtras = new Date();
    sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 7);
    
    const ventasUltimos7Dias = await db.collection('sales').aggregate([
      { $match: { fecha: { $gte: sieteDiasAtras } } },
      { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
    ]).toArray();

    // Actividad de clientes
    const actividadClientes = await db.collection('customeractivities').aggregate([
      { $group: { _id: '$clienteId', visitas: { $sum: 1 }, ultimaVisita: { $max: '$fecha' } } },
      { $sort: { visitas: -1 } },
      { $limit: 10 }
    ]).toArray();

    return NextResponse.json({
      totalVentas: totalVentas[0] || { total: 0, count: 0 },
      platosPopulares,
      inventarioBajo: inventarioBajo.length,
      productosBajoStock: inventarioBajo,
      ventasUltimos7Dias: ventasUltimos7Dias[0] || { total: 0, count: 0 },
      actividadClientes
    });
  } catch (error) {
    console.error('Error al obtener analytics:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}