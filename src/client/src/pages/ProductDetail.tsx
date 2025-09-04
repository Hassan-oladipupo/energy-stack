"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, RefreshCw } from "lucide-react"
import type { Product } from "../types"
import { productApi } from "../services/api"
import { useCart } from "../contexts/CartContext"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { addToCart, loading: cartLoading } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const fetchProduct = async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)
      const response = await productApi.getProduct(Number.parseInt(id))
      setProduct(response.data)
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load product")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!product) return

    try {
      setIsAdding(true)
      await addToCart(product.id, quantity)
      // Show success message or redirect
    } catch (error) {
      // Error is handled by CartContext
    } finally {
      setIsAdding(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      "solar-panels": "Solar Panels",
      inverters: "Inverters",
      batteries: "Batteries",
      accessories: "Accessories",
    }
    return labels[category] || category
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error || "Product not found"} onRetry={fetchProduct} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/products" className="flex items-center gap-1 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <span>/</span>
        <span>{getCategoryLabel(product.category)}</span>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.images[selectedImage] || "/placeholder.svg?height=600&width=600"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-purple-600" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg?height=80&width=80"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="inline-block px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full mb-3">
              {getCategoryLabel(product.category)}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-sm text-gray-600 ml-2">(4.8) • 127 reviews</span>
              </div>
            </div>

            <p className="text-4xl font-bold text-gray-900 mb-6">{formatPrice(product.price)}</p>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
            <span className={`font-medium ${product.stock > 0 ? "text-green-700" : "text-red-700"}`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Quantity and Add to Cart */}
          {product.stock > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="font-medium text-gray-700">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {Array.from({ length: Math.min(10, product.stock) }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding || cartLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {isAdding ? "Adding to Cart..." : "Add to Cart"}
              </button>
            </div>
          )}

          {/* Features */}
          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Truck className="h-5 w-5" />
              <span>Free shipping on orders over $500</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Shield className="h-5 w-5" />
              <span>2-year manufacturer warranty</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <RefreshCw className="h-5 w-5" />
              <span>30-day return policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
