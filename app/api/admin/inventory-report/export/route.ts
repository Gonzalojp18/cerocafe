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

    // Generar CSV
    const headers = [
      'Producto',
      'Categoría',
      'Stock Actual',
      'Stock Mínimo',
      'Precio',
      'Ventas Totales',
      'Estado',
      'Valor del Inventario',
      'Última Venta'
    ];

    const rows = dishes.map(dish => {
      const inventario = dish.inventario || 0;
      const stockMinimo = dish.stockMinimo || 10;
      
      let status = 'Normal';
      if (inventario === 0) status = 'Agotado';
      else if (inventario <= stockMinimo * 0.5) status = 'Crítico';
      else if (inventario <= stockMinimo) status = 'Bajo';

      const valorInventario = inventario * dish.precio;
      const ultimaVenta = dish.fechaUltimaVenta 
        ? new Date(dish.fechaUltimaVenta).toLocaleDateString('es-ES')
        : 'N/A';

      return [
        `"${dish.nombre}"`,
        `"${dish.categoria}"`,
        inventario.toString(),
        stockMinimo.toString(),
        dish.precio.toFixed(2),
        (dish.ventas || 0).toString(),
        status,
        valorInventario.toFixed(2),
        ultimaVenta
      ].join(',');
    });

    const csvContent = [
      headers.join(','),
      ...rows
    ].join('\n');

    // Agregar BOM para caracteres especiales en Excel
    const bom = '\uFEFF';
    const csvWithBom = bom + csvContent;

    return new NextResponse(csvWithBom, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="inventory-report-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    console.error('Error al exportar reporte de inventario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}