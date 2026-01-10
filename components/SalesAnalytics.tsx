'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface SalesData {
  fecha: string;
  total: number;
  count: number;
}

interface CategoryData {
  categoria: string;
  total: number;
  count: number;
}

interface DishData {
  nombre: string;
  total: number;
  count: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function SalesAnalytics() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [topDishes, setTopDishes] = useState<DishData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch sales data for the last 30 days
        const response = await fetch('/api/admin/sales-analytics');
        const data = await response.json();
        
        setSalesData(data.ventasDiarias || []);
        setCategoryData(data.ventasPorCategoria || []);
        setTopDishes(data.platosMasVendidos || []);
      } catch (error) {
        console.error('Error al cargar analytics de ventas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div>Cargando analytics de ventas...</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Analytics de Ventas</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas Diarias */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas de los Últimos 30 Días</CardTitle>
            <CardDescription>Tendencia de ventas diarias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total']}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ventas por Categoría */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Categoría</CardTitle>
            <CardDescription>Distribución de ventas por tipo de plato</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ categoria, percent }) => `${categoria} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Plato Más Vendidos */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Platos Más Vendidos</CardTitle>
            <CardDescription>Top 10 platos más populares</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topDishes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'count' ? value : `$${value.toFixed(2)}`, 
                    name === 'count' ? 'Cantidad' : 'Total'
                  ]}
                />
                <Bar dataKey="count" fill="#8884d8" />
                <Bar dataKey="total" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Resumen Numérico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total de Ventas (30 días)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${salesData.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
            </div>
            <p className="text-sm text-gray-600">
              {salesData.reduce((sum, item) => sum + item.count, 0)} transacciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Promedio Diario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${salesData.length > 0 ? (salesData.reduce((sum, item) => sum + item.total, 0) / salesData.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-sm text-gray-600">
              Por día
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Día Mejor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${salesData.length > 0 ? Math.max(...salesData.map(item => item.total)).toFixed(2) : '0.00'}
            </div>
            <p className="text-sm text-gray-600">
              Mejor día de ventas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}