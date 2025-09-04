export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  stock: number
  images: string[]
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  id: number
  cartId: number
  productId: number
  quantity: number
  product: Product
  createdAt: string
  updatedAt: string
}

export interface Cart {
  id: number
  sessionId: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: number
  sessionId: string
  status: "pending" | "placed" | "shipped" | "delivered"
  subtotal: number
  tax: number
  total: number
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  price: number
  product: Product
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ProductFilters {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}
