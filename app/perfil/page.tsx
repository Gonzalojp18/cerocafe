'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, User, Mail, Shield, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
    const { data: session } = useSession()
    const router = useRouter()

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-sm text-center">
                    <CardHeader>
                        <CardTitle>No has iniciado sesión</CardTitle>
                        <CardDescription>
                            Debes iniciar sesión para ver tu perfil.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/login">
                            <Button className="w-full bg-[#FB732F] hover:bg-[#FB732F]/90">
                                Iniciar Sesión
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const { user } = session
    const initials = user?.name
        ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)
        : 'U'

    return (
        <div className="min-h-screen bg-gray-50 pb-20"> {/* pb-20 for BottomNav space */}
            <div className="bg-[#FB732F] h-32 w-full absolute top-0 z-0 rounded-b-[2rem]"></div>

            <div className="container max-w-md mx-auto px-4 relative z-10 pt-16">
                <div className="flex flex-col items-center mb-6">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg mb-4">
                        <AvatarImage src={user.image || ''} alt={user.name || ''} />
                        <AvatarFallback className="bg-orange-100 text-[#FB732F] text-2xl font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                    <p className="text-gray-500">{user.email}</p>
                </div>

                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-5 w-5 text-[#FB732F]" />
                                Información Personal
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Mail className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="font-medium text-sm">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Shield className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Rol</p>
                                    <p className="font-medium text-sm capitalize">{user.role}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 pt-4">
                            <Link href="/mis-pedidos">
                                <Button variant="outline" className="w-full justify-start h-12 text-base font-normal">
                                    <ShoppingBag className="mr-3 h-5 w-5 text-[#FB732F]" />
                                    Mis Pedidos
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Button
                        variant="destructive"
                        className="w-full h-12 mt-6 text-base"
                        onClick={() => signOut({ callbackUrl: '/login' })}
                    >
                        <LogOut className="mr-2 h-5 w-5" />
                        Cerrar Sesión
                    </Button>
                </div>
            </div>
        </div>
    )
}
