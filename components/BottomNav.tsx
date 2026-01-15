'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingBag, User } from 'lucide-react'

export default function BottomNav() {
    const pathname = usePathname()

    // Determine active state helper
    const isActive = (path: string) => pathname === path

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50 h-16 safe-area-pb">
            <div className="grid grid-cols-3 h-full max-w-md mx-auto">
                {/* Inicio (Takeaway) */}
                <Link
                    href="/takeaway"
                    className={`flex flex-col items-center justify-center gap-1 transition-colors ${isActive('/takeaway') ? 'text-[#FB732F]' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <Home className={`h-6 w-6 ${isActive('/takeaway') ? 'fill-current' : ''}`} />
                    <span className="text-[10px] font-medium">Inicio</span>
                </Link>

                {/* Mis Pedidos */}
                <Link
                    href="/mis-pedidos"
                    className={`flex flex-col items-center justify-center gap-1 transition-colors ${isActive('/mis-pedidos') ? 'text-[#FB732F]' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <ShoppingBag className={`h-6 w-6 ${isActive('/mis-pedidos') ? 'fill-current' : ''}`} />
                    <span className="text-[10px] font-medium">Mis Pedidos</span>
                </Link>

                {/* Perfil */}
                <Link
                    href="/perfil"
                    className={`flex flex-col items-center justify-center gap-1 transition-colors ${isActive('/perfil') ? 'text-[#FB732F]' : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <User className={`h-6 w-6 ${isActive('/perfil') ? 'fill-current' : ''}`} />
                    <span className="text-[10px] font-medium">Perfil</span>
                </Link>
            </div>
        </div>
    )
}
