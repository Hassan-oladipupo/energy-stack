"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { CheckCircle, Package, Truck, ArrowRight } from "lucide-react"
import type { Order } from "../types"
import { orderApi } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrder = async () => {
    if (!orderId) return

    try {
      setLoading(true)
      setError(null)
      const response = await orderApi.getOrder(Number.parseInt(orderId))
      setOrder(response.data)
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load order")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error || "Order not found"} onRetry={fetchOrder} />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Header */}
      <div className="text-center mb-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
      </div>

      {/* Order Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Order Number</h3>
            <p className="text-gray-600">#{order.id.toString().padStart(6, "0")}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Order Date</h3>
            <p className="text-gray-600">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <img
                  src={item.product.images[0] || "/placeholder.svg?height=80&width=80"}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                  <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                  <p className="text-gray-600 text-sm">Price: {formatPrice(item.price)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Total */}
        <div className="border-t pt-6 mt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-blue-900 mb-4">What's Next?</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800">We're preparing your order for shipment</span>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800">You'll receive tracking information via email</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800">Estimated delivery: 3-5 business days</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/products"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          Continue Shopping
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Print Order
        </button>
      </div>
    </div>
  )
}

export default OrderConfirmation
