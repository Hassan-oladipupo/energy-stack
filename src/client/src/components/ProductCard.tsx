"use client"

import React from "react"
import { Link } from "react-router-dom"
import { ShoppingCart, Star } from "lucide-react"
import type { Product } from "../types"
import { useCart } from "../contexts/CartContext"

interface ProductCardProps {
  product: Product
  viewMode: "grid" | "list"
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode }) => {
  const { addToCart, loading } = useCart()
  const [isAdding, setIsAdding] = React.useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      setIsAdding(true)
      await addToCart(product.id, 1)
    } catch (error) {
      // Error is handled by CartContext
    } finally {
      setIsAdding(false)
    }
  }

 const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
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

  if (viewMode === "list") {
    return (
      <Link to={`/products/${product.id}`} className="block">
     <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow w-full">
  <div className="flex flex-col md:flex-row gap-4 w-full">
    <div className="md:w-40 flex-shrink-0">
      <img
        src={product.images[0] || "/placeholder.svg?height=200&width=200"}
        alt={product.name}
        className="w-full h-40 object-cover rounded-lg"
      />
    </div>

    <div className="flex-1">
      <div className="flex items-start justify-between mb-1">
        <div>
         <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary text-white rounded-full mb-1">
  {getCategoryLabel(product.category)}
</span>

          <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</p>
          <p className="text-xs text-gray-500">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
        </div>
      </div>

      <p className="text-gray-600 mb-3 line-clamp-3 text-sm">{product.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-xs text-gray-500 ml-1">(4.8)</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding || loading}
          className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          <ShoppingCart className="h-3 w-3" />
          {isAdding ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  </div>
</div>

      </Link>
    )
  }

  return (
    <Link to={`/products/${product.id}`} className="block group">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.images[0] || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-4">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-primary text-white rounded-full mb-2">
       {getCategoryLabel(product.category)}
      </span>


          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs text-gray-500 ml-1">(4.8)</span>
            </div>
            <p className="text-sm text-gray-500">{product.stock > 0 ? `${product.stock} left` : "Out of stock"}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>

       <button
  onClick={handleAddToCart}
  disabled={product.stock === 0 || isAdding || loading}
  className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-sm rounded-md hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
>
  <ShoppingCart className="h-3 w-3" />
  {isAdding ? "Adding..." : "Add"}
</button>


          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
