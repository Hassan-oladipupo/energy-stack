"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"
import { useCart } from "../contexts/CartContext"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"

const Cart: React.FC = () => {
  const { cart, loading, error, updateCartItem, removeFromCart, clearError } = useCart()

  const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(price)
}

  const calculateSubtotal = () => {
    if (!cart?.items) return 0
    return cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.08 // 8% tax rate
  }

  const subtotal = calculateSubtotal()
  const tax = calculateTax(subtotal)
  const total = subtotal + tax

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    try {
      await updateCartItem(itemId, newQuantity)
    } catch (error) {
      // Error handled by context
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId)
    } catch (error) {
      // Error handled by context
    }
  }

  if (loading && !cart) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {error && <ErrorMessage message={error} onRetry={clearError} className="mb-6" />}

      {!cart?.items || cart.items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={item.product.images[0] || "/placeholder.svg?height=120&width=120"}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.product.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.product.description}</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">{formatPrice(item.product.price)}</p>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, Math.max(0, item.quantity - 1))}
                        disabled={loading}
                        className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="w-12 text-center font-medium">{item.quantity}</span>

                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={loading || item.quantity >= item.product.stock}
                        className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-lg font-bold text-gray-900">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{subtotal >= 500 ? "Free" : formatPrice(25)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(total + (subtotal >= 500 ? 0 : 25))}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-accent-700 transition-colors"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/products"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 mt-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </Link>

              {subtotal < 500 && (
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Add {formatPrice(500 - subtotal)} more for free shipping!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && cart?.items && cart.items.length > 0 && (
       <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <LoadingSpinner />
  </div>
</div>

      )}
    </div>
  )
}

export default Cart
