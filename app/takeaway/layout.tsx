import { CartProvider } from '@/app/contexts/CartContext'

export default function TakeAwayLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <CartProvider>
            <div className="min-h-screen bg-gray-50">
                {children}
            </div>
        </CartProvider>
    )
}