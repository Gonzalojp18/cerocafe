'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, UserPlus, Users } from 'lucide-react'

type User = {
  _id: string
  name: string
  dni: string
  email: string
  role: string
  points: number
  createdAt: string
}

export default function UsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    email: '',
    password: '',
    role: 'staff'
  })
  const [procesando, setProcesando] = useState(false)

  // Protección de ruta
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

    fetchUsers()
  }, [session, status, router])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()

      if (response.ok) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcesando(true)

    try {
      const response = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        alert('✅ Usuario creado exitosamente')
        setFormData({ name: '', dni: '', email: '', password: '', role: 'staff' })
        setShowCreateForm(false)
        fetchUsers()
      } else {
        alert(data.error || 'Error al crear usuario')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear usuario')
    } finally {
      setProcesando(false)
    }
  }

  const handleChangeRole = async (userId: string, newRole: string) => {
    if (!confirm(`¿Cambiar el rol de este usuario a ${newRole}?`)) {
      return
    }

    try {
      const response = await fetch('/api/admin/users/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole })
      })

      const data = await response.json()

      if (response.ok) {
        alert('✅ Rol actualizado exitosamente')
        fetchUsers()
      } else {
        alert(data.error || 'Error al actualizar rol')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar rol')
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800'
      case 'staff': return 'bg-blue-100 text-blue-800'
      case 'customer': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Cargando...</p>
      </div>
    )
  }

  if (session?.user?.role !== 'owner') {
    return null
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/admin">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Admin
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Users className="h-8 w-8" />
        Gestión de Usuarios
      </h1>

      {/* Botón crear usuario */}
      <div className="mb-6">
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-[#FB732F] hover:bg-[#FB732F]/90"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          {showCreateForm ? 'Cancelar' : 'Crear Usuario Staff'}
        </Button>
      </div>

      {/* Formulario de creación */}
      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Crear Nuevo Usuario</CardTitle>
            <CardDescription>Completa los datos para crear un usuario staff</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nombre completo</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">DNI</label>
                <Input
                  type="text"
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                  placeholder="12345678"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Contraseña</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Rol</label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff (Empleado)</SelectItem>
                    <SelectItem value="customer">Customer (Cliente)</SelectItem>
                    <SelectItem value="owner">Owner (Dueño)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={procesando} className="w-full">
                {procesando ? 'Creando...' : 'Crear Usuario'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Todos los Usuarios ({users.length})</CardTitle>
          <CardDescription>Gestiona los roles de los usuarios del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Nombre</th>
                  <th className="text-left p-3">DNI</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Rol</th>
                  <th className="text-left p-3">Puntos</th>
                  <th className="text-left p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.dni}</td>
                    <td className="p-3 text-sm">{user.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3">{user.points}</td>
                    <td className="p-3">
                      <Select 
                        defaultValue={user.role}
                        onValueChange={(newRole) => handleChangeRole(user._id, newRole)}
                        disabled={user._id === session?.user?.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                        </SelectContent>
                      </Select>
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