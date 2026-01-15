'use client'

import { usePathname } from 'next/navigation'
import BottomNav from './BottomNav'

export default function NavWrapper() {
    const pathname = usePathname()

    // Rutas donde NO se debe mostrar el BottomNav
    const hiddenRoutes = ['/login', '/registro', '/admin', '/caja', '/menu']
    const isHidden = hiddenRoutes.some(route => pathname?.startsWith(route)) || pathname === '/'

    // Mostrar solo en: /takeaway, /mis-pedidos, /perfil
    // O mejor lógica: Ocultar en las definidas y mostrar en el resto?
    // User dijo: "nav que podran ver todos los usuarios en la vista principal del takeaway"

    // Vamos a ser explícitos: mostrar SOLO en las rutas de la app de cliente
    const showNav = ['/takeaway', '/mis-pedidos', '/perfil'].some(route => pathname?.startsWith(route))

    if (!showNav) return null

    return <BottomNav />
}
