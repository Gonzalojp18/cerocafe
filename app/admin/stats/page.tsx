'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, TrendingUp, Award, Activity, BarChart3 } from 'lucide-react'

type Stats = {
  general: {
    totalCustomers: number
    pointsInCirculation: number
    totalPointsAdded: number
    totalPointsSubtracted: number
  }
  recent: {
    pointsToday: number
    pointsWeek: number
    pointsMonth: number
    activeCustomers: number
  }
  topCustomers: {
    byPoints: Array<{
      _id: string
      name: string
      dni: string
      points: number
    }>
    byTransactions: Array<{
      _id: string
      customerName: string
      customerDni: string
      totalTransactions: number
    }>
  }
  staff: Array<{
    _id: string
    staffName: string
    staffRole: string
    totalTransactions: number
    pointsAdded: number
    pointsSubtracted: number
  }>
}

export default function StatsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session?.user?.role !== 'owner') {
      router.push('/cerocafe')
      return
    }

    fetchStats()
  }, [session, status, router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()

      if (response.ok) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Cargando estadísticas...</p>
      </div>
    )
  }

  if (session?.user?.role !== 'owner' || !stats) {
    return null
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/admin">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Admin
          </Button>
        </Link>
        <Button onClick={fetchStats} variant="outline" size="sm">
          Actualizar
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <BarChart3 className="h-8 w-8" />
        Dashboard de Estadísticas
      </h1>

      {/* ===== RESUMEN GENERAL ===== */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">📊 Resumen General</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-3xl font-bold">{stats.general.totalCustomers}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Puntos en Circulación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[#FB732F]" />
                <span className="text-3xl font-bold">{stats.general.pointsInCirculation}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Puntos Otorgados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-3xl font-bold text-green-600">
                  +{stats.general.totalPointsAdded}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Puntos Canjeados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-red-500" />
                <span className="text-3xl font-bold text-red-600">
                  -{stats.general.totalPointsSubtracted}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ===== ACTIVIDAD RECIENTE ===== */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">⚡ Actividad Reciente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Puntos Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-green-600">
                +{stats.recent.pointsToday}
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Puntos Esta Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-green-600">
                +{stats.recent.pointsWeek}
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Puntos Este Mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-green-600">
                +{stats.recent.pointsMonth}
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Clientes Activos (30 días)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-blue-600">
                {stats.recent.activeCustomers}
              </span>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ===== TOP CLIENTES ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top por Puntos */}
        <Card>
          <CardHeader>
            <CardTitle>🏆 Top 10 - Más Puntos</CardTitle>
            <CardDescription>Clientes con mayor saldo de puntos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topCustomers.byPoints.map((customer, index) => (
                <div
                  key={customer._id}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400 w-6">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-semibold">{customer.name}</p>
                      <p className="text-xs text-gray-500">DNI: {customer.dni}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-[#FB732F]">
                    {customer.points} pts
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top por Transacciones */}
        <Card>
          <CardHeader>
            <CardTitle>📈 Top 10 - Más Activos</CardTitle>
            <CardDescription>Clientes con más transacciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topCustomers.byTransactions.map((customer, index) => (
                <div
                  key={customer._id}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400 w-6">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-semibold">{customer.customerName}</p>
                      <p className="text-xs text-gray-500">DNI: {customer.customerDni}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {customer.totalTransactions} ops
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== ANÁLISIS DE STAFF ===== */}
      <Card>
        <CardHeader>
          <CardTitle>👥 Rendimiento del Equipo</CardTitle>
          <CardDescription>Actividad de cada miembro del staff</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Staff</th>
                  <th className="text-left p-3">Rol</th>
                  <th className="text-right p-3">Transacciones</th>
                  <th className="text-right p-3">Puntos Otorgados</th>
                  <th className="text-right p-3">Puntos Restados</th>
                </tr>
              </thead>
              <tbody>
                {stats.staff.map((member) => (
                  <tr key={member._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">{member.staffName}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        member.staffRole === 'owner' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {member.staffRole}
                      </span>
                    </td>
                    <td className="p-3 text-right font-semibold">
                      {member.totalTransactions}
                    </td>
                    <td className="p-3 text-right text-green-600 font-semibold">
                      +{member.pointsAdded}
                    </td>
                    <td className="p-3 text-right text-red-600 font-semibold">
                      -{member.pointsSubtracted}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}