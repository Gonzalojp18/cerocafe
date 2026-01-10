'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, Users, Package } from 'lucide-react';

interface AnalyticsData {
  totalVentas: { total: number; count: number };
  platosPopulares: Array<{ nombre: string; totalVentas: number }>;
  inventarioBajo: number;
  productosBajoStock: Array<any>;
  ventasUltimos7Dias: { total: number; count: number };
  actividadClientes: Array<any>;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin/analytics');
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (error) {
        console.error('Error al cargar analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div>Cargando analytics...</div>;
  }

  if (!data) {
    return <div>Error al cargar los datos</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Analytics y Reportes</h2>
      
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.totalVentas.total.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {data.totalVentas.count} transacciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Últimos 7 Días</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.ventasUltimos7Dias.total.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {data.ventasUltimos7Dias.count} transacciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.inventarioBajo}</div>
            <p className="text-xs text-muted-foreground">
              Productos necesitan reabastecimiento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.actividadClientes.length}</div>
            <p className="text-xs text-muted-foreground">
              Clientes con actividad reciente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de inventario */}
      {data.productosBajoStock.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Inventario
            </CardTitle>
            <CardDescription>
              Productos con stock bajo o agotado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.productosBajoStock.map((producto: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span className="font-medium">{producto.nombre}</span>
                  <span className="text-red-600">
                    Stock: {producto.inventario} / Mínimo: {producto.stockMinimo}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platos más populares */}
      <Card>
        <CardHeader>
          <CardTitle>Platos Más Populares</CardTitle>
          <CardDescription>
            Los platos más vendidos del restaurante
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.platosPopulares.map((plato, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium">{plato.nombre}</span>
                <span className="text-gray-600">
                  {plato.totalVentas} vendidos
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}