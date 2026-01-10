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

    // Obtener todos los platos con información de inventario
    const dishes = await db.collection('dishes').find({}).toArray();

    // Calcular estadísticas y determinar estado de cada producto
    const items = dishes.map(dish => {
      const inventario = dish.inventario || 0;
      const stockMinimo = dish.stockMinimo || 10;
      
      let status: 'normal' | 'low' | 'critical' | 'out' = 'normal';
      
      if (inventario === 0) {
        status = 'out';
      } else if (inventario <= stockMinimo * 0.5) {
        status = 'critical';
      } else if (inventario <= stockMinimo) {
        status = 'low';
      }

      return {
        _id: dish._id.toString(),
        nombre: dish.nombre,
        categoria: dish.categoria,
        inventario,
        stockMinimo,
        precio: dish.precio,
        ventas: dish.ventas || 0,
        fechaUltimaVenta: dish.fechaUltimaVenta,
        status
      };
    });

    // Calcular estadísticas generales
    const totalItems = items.length;
    const lowStockItems = items.filter(item => item.status === 'low').length;
    const criticalItems = items.filter(item => item.status === 'critical').length;
    const outOfStockItems = items.filter(item => item.status === 'out').length;
    const totalInventoryValue = items.reduce((sum, item) => sum + (item.inventario * item.precio), 0);

    return NextResponse.json({
      items,
      totalItems,
      lowStockItems,
      criticalItems,
      outOfStockItems,
      totalInventoryValue
    });
  } catch (error) {
    console.error('Error al generar reporte de inventario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}