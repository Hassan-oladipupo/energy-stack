"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Cart } from "../types"
import { cartApi } from "../services/api"
import toast from "react-hot-toast"

interface CartContextType {
  cart: Cart | null
  loading: boolean
  error: string | null
  addToCart: (productId: number, quantity: number) => Promise<void>
  updateCartItem: (itemId: number, quantity: number) => Promise<void>
  removeFromCart: (itemId: number) => Promise<void>
  clearError: () => void
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate or get session ID
  const getSessionId = () => {
    let sessionId = localStorage.getItem("sessionId")
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("sessionId", sessionId)
    }
    return sessionId
  }

  const sessionId = getSessionId()

  const refreshCart = async () => {
    try {
      setLoading(true)
      const response = await cartApi.getCart(sessionId)
      setCart(response.data)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load cart")
       toast.error("Failed to load cart")
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: number, quantity: number) => {
    try {
      setLoading(true)
      const response = await cartApi.addToCart(sessionId, productId, quantity)
      setCart(response.data)
      setError(null)
       toast.success("Item added to cart!")
    } catch (err: any) {
     const message = err.response?.data?.error || "Failed to add item to cart"
      setError(message)
      toast.error(`${message}`)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateCartItem = async (itemId: number, quantity: number) => {
    try {
      setLoading(true)
      const response = await cartApi.updateCartItem(sessionId, itemId, quantity)
      setCart(response.data)
      setError(null)
      toast.success("Cart updated successfully!")
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update cart item")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (itemId: number) => {
    try {
      setLoading(true)
      const response = await cartApi.removeFromCart(sessionId, itemId)
      setCart(response.data)
      setError(null)
       toast.success("Item removed from cart!")
    } catch (err: any) {
     const message = err.response?.data?.error || "Failed to remove item from cart"
      setError(message)
      toast.error(`⚠️ ${message}`)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  useEffect(() => {
    refreshCart()
  }, [])

  const value: CartContextType = {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearError,
    refreshCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
