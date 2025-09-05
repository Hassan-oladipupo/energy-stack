import axios from "axios"
import type { Product, Cart, Order, ApiResponse, PaginatedResponse, ProductFilters } from "../types"

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://energy-stack-api.onrender.com/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Request interceptor for logging
api.interceptors.request.use((config) => {
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API Error]", error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export const productApi = {
  getProducts: (filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> =>
    api.get("/products", { params: filters }).then((res) => res.data),

  getProduct: (id: number): Promise<ApiResponse<Product>> => api.get(`/products/${id}`).then((res) => res.data),
}

export const cartApi = {
  getCart: (sessionId: string): Promise<ApiResponse<Cart>> => api.get(`/cart/${sessionId}`).then((res) => res.data),

  addToCart: (sessionId: string, productId: number, quantity: number): Promise<ApiResponse<Cart>> =>
    api.post(`/cart/${sessionId}`, { productId, quantity }).then((res) => res.data),

  updateCartItem: (sessionId: string, itemId: number, quantity: number): Promise<ApiResponse<Cart>> =>
    api.put(`/cart/${sessionId}/items/${itemId}`, { quantity }).then((res) => res.data),

  removeFromCart: (sessionId: string, itemId: number): Promise<ApiResponse<Cart>> =>
    api.delete(`/cart/${sessionId}/items/${itemId}`).then((res) => res.data),
}

export const orderApi = {
  createOrder: (sessionId: string): Promise<ApiResponse<Order>> =>
    api.post("/orders", { sessionId }).then((res) => res.data),

  getOrder: (id: number): Promise<ApiResponse<Order>> => api.get(`/orders/${id}`).then((res) => res.data),
}
