'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Clock, TrendingUp, Eye } from 'lucide-react';

interface CustomerActivity {
  _id: string;
  clienteId: string;
  accion: string;
  fecha: string;
  detalles?: any;
}

interface VisitPattern {
  hora: string;
  visitas: number;
}

interface CustomerData {
  clienteId: string;
  visitas: number;
  ultimaVisita: string;
  pedidos: number;
  totalGastado: number;
}

export default function CustomerAnalytics() {
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [visitPatterns, setVisitPatterns] = useState<VisitPattern[]>([]);
  const [recentActivity, setRecentActivity] = useState<CustomerActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin/customer-analytics');
        const data = await response.json();
        
        setCustomerData(data.clientesTop || []);
        setVisitPatterns(data.patronesVisitas || []);
        setRecentActivity(data.actividadReciente || []);
      } catch (error) {
        console.error('Error al cargar analytics de clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div>Cargando analytics de clientes...</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Analytics de Clientes</h3>
      
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerData.length}</div>
            <p className="text-xs text-muted-foreground">
              Clientes con actividad reciente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitas Hoy</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {visitPatterns.reduce((sum, item) => sum + item.visitas, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Visitas del día actual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliente Más Fiel</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customerData.length > 0 ? customerData[0].visitas : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Mayor número de visitas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${customerData.length > 0 
                ? (customerData.reduce((sum, item) => sum + item.totalGastado, 0) / customerData.length).toFixed(2)
                : '0.00'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Gasto promedio por cliente
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patrones de Visita por Hora */}
        <Card>
          <CardHeader>
            <CardTitle>Patrones de Visita por Hora</CardTitle>
            <CardDescription>Distribución de visitas durante el día</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitPatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis />
                <Tooltip formatter={(value: number) => [value, 'Visitas']} />
                <Bar dataKey="visitas" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Clientes */}
        <Card>
          <CardHeader>
            <CardTitle>Clientes Más Activos</CardTitle>
            <CardDescription>Top 10 clientes por actividad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {customerData.slice(0, 10).map((customer, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">Cliente {customer.clienteId.slice(0, 8)}</span>
                    <p className="text-xs text-gray-500">
                      {customer.pedidos} pedidos • ${customer.totalGastado.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{customer.visitas} visitas</div>
                    <div className="text-xs text-gray-500">
                      {new Date(customer.ultimaVisita).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actividad Reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Últimas actividades de clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentActivity.slice(0, 20).map((activity, index) => (
              <div key={index} className="flex justify-between items-center p-2 border-b">
                <div>
                  <span className="font-medium">{activity.accion}</span>
                  <p className="text-xs text-gray-500">
                    Cliente: {activity.clienteId.slice(0, 8)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">
                    {new Date(activity.fecha).toLocaleString()}
                  </div>
                  {activity.detalles && (
                    <div className="text-xs text-blue-600">
                      {JSON.stringify(activity.detalles)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}