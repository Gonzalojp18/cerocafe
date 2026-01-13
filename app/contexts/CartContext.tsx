'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
    dishId: string
    name: string
    price: number
    quantity: number
    image?: string
}

interface CartContextType {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'quantity'>) => void
    removeItem: (dishId: string) => void
    updateQuantity: (dishId: string, quantity: number) => void
    clearCart: () => void
    total: number
    itemCount: number
    pointsToEarn: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])

    // Cargar carrito desde localStorage al montar
    useEffect(() => {
        const savedCart = localStorage.getItem('takeaway_cart')
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (error) {
                console.error('Error loading cart:', error)
            }
        }
    }, [])

    // Guardar carrito en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem('takeaway_cart', JSON.stringify(items))
    }, [items])

    const addItem = (item: Omit<CartItem, 'quantity'>) => {
        setItems(prev => {
            const existingItem = prev.find(i => i.dishId === item.dishId)

            if (existingItem) {
                return prev.map(i =>
                    i.dishId === item.dishId
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                )
            }

            return [...prev, { ...item, quantity: 1 }]
        })
    }

    const removeItem = (dishId: string) => {
        setItems(prev => prev.filter(i => i.dishId !== dishId))
    }

    const updateQuantity = (dishId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(dishId)
            return
        }

        setItems(prev =>
            prev.map(i =>
                i.dishId === dishId ? { ...i, quantity } : i
            )
        )
    }

    const clearCart = () => {
        setItems([])
        localStorage.removeItem('takeaway_cart')
    }

    // Calcular total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Calcular cantidad de items
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

    // Calcular puntos a ganar (1 punto por cada $10)
    const pointsToEarn = Math.floor(total / 10)

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                total,
                itemCount,
                pointsToEarn,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within CartProvider')
    }
    return context
}