export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  stock: number
  images: string[]
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: number
  productId: number
  quantity: number
  product?: Product
}

export interface Cart {
  id: number
  sessionId: string
  items: CartItem[]
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: number
  sessionId: string
  status: "pending" | "placed" | "shipped" | "delivered"
  subtotal: number
  tax: number
  total: number
  items: OrderItem[]
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  price: number
  product?: Product
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
