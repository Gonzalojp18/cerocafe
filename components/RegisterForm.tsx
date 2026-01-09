'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterForm() {
    const [name, setName] = useState('')
    const [dni, setDni] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validar DNI
        if (!/^\d{7,8}$/.test(dni)) {
            setError('El DNI debe tener 7 u 8 dígitos')
            return
        }

        setLoading(true)

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, dni, email, password })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Error al registrarse')
            } else {
                // Auto-login después del registro
                const loginResult = await signIn('credentials', {
                    email,
                    password,
                    redirect: false
                })

                if (loginResult?.error) {
                    router.push('/login?registered=true')
                } else {
                    router.push('/')  // Redirige al menú
                }




            }
        } catch (error) {
            setError('Ocurrió un error. Intenta nuevamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nombre completo
                    </label>
                    <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    />
                </div>

                <div>
                    <label htmlFor="dni" className="block text-sm font-medium text-gray-700">
                        DNI
                    </label>
                    <input
                        id="dni"
                        type="text"
                        required
                        maxLength={8}
                        pattern="\d{7,8}"
                        value={dni}
                        onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                        placeholder="12345678"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    />
                    <p className="mt-1 text-xs text-gray-500">Sin puntos ni guiones</p>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Contraseña
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    />
                    <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres</p>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
            >
                {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>

            <p className="text-center text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="font-medium text-black hover:underline">
                    Inicia sesión aquí
                </Link>
            </p>
        </form>
    )
}