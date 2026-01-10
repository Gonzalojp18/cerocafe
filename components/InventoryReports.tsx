'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Package, AlertTriangle, TrendingDown, RefreshCw } from 'lucide-react';

interface InventoryItem {
  _id: string;
  nombre: string;
  categoria: string;
  inventario: number;
  stockMinimo: number;
  precio: number;
  ventas: number;
  fechaUltimaVenta?: string;
  status: 'normal' | 'low' | 'critical' | 'out';
}

interface InventoryReport {
  items: InventoryItem[];
  totalItems: number;
  lowStockItems: number;
  criticalItems: number;
  outOfStockItems: number;
  totalInventoryValue: number;
}

export default function InventoryReports() {
  const [report, setReport] = useState<InventoryReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchInventoryReport = async () => {
      try {
        const response = await fetch('/api/admin/inventory-report');
        const data = await response.json();
        setReport(data);
      } catch (error) {
        console.error('Error al cargar reporte de inventario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryReport();
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await fetch('/api/admin/inventory-report/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al exportar reporte:', error);
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadge = (item: InventoryItem) => {
    switch (item.status) {
      case 'out':
        return <Badge variant="destructive">Agotado</Badge>;
      case 'critical':
        return <Badge variant="destructive">Crítico</Badge>;
      case 'low':
        return <Badge variant="secondary">Bajo</Badge>;
      default:
        return <Badge variant="default">Normal</Badge>;
    }
  };

  const getStockIcon = (item: InventoryItem) => {
    switch (item.status) {
      case 'out':
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'low':
        return <TrendingDown className="h-4 w-4 text-yellow-500" />;
      default:
        return <Package className="h-4 w-4 text-green-500" />;
    }
  };

  if (loading) {
    return <div>Cargando reporte de inventario...</div>;
  }

  if (!report) {
    return <div>Error al cargar el reporte</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Reporte de Inventario</h3>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={handleExport} disabled={exporting} size="sm">
            <Download className="h-4 w-4 mr-2" />
            {exporting ? 'Exportando...' : 'Exportar CSV'}
          </Button>
        </div>
      </div>

      {/* Resumen de inventario */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.totalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Normal</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {report.totalItems - report.lowStockItems - report.criticalItems - report.outOfStockItems}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{report.lowStockItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Crítico</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{report.criticalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${report.totalInventoryValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de inventario */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Inventario</CardTitle>
          <CardDescription>
            Estado actual de todos los productos del menú
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Stock Actual</TableHead>
                <TableHead>Stock Mínimo</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Ventas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Valor Inventario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.nombre}</TableCell>
                  <TableCell>{item.categoria}</TableCell>
                  <TableCell className={item.inventario <= item.stockMinimo ? 'text-red-600 font-bold' : ''}>
                    <div className="flex items-center gap-2">
                      {getStockIcon(item)}
                      {item.inventario}
                    </div>
                  </TableCell>
                  <TableCell>{item.stockMinimo}</TableCell>
                  <TableCell>${item.precio.toFixed(2)}</TableCell>
                  <TableCell>{item.ventas}</TableCell>
                  <TableCell>{getStatusBadge(item)}</TableCell>
                  <TableCell>${(item.inventario * item.precio).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}