"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Filter, Grid, List, ChevronLeft, ChevronRight } from "lucide-react"
import type { Product, ProductFilters } from "../types"
import { productApi } from "../services/api"
import ProductCard from "../components/ProductCard"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "solar-panels", label: "Solar Panels" },
  { value: "inverters", label: "Inverters" },
  { value: "batteries", label: "Batteries" },
  { value: "accessories", label: "Accessories" },
]

const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
    search: "",
    category: "",
    minPrice: undefined,
    maxPrice: undefined,
  })

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  })

const fetchProducts = async () => {
  try {
    setLoading(true)
    setError(null)

    const responseData = await productApi.getProducts(filters) // ProductResponse
    setProducts(responseData.data)
    setPagination(responseData.pagination)
  } catch (err: any) {
    setError(err.response?.data?.errors?.[0]?.msg || "Failed to load products")
  } finally {
    setLoading(false)
  }
}




  useEffect(() => {
    fetchProducts()
  }, [filters])

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value, // Reset to page 1 when changing filters
    }))
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const search = formData.get("search") as string
    handleFilterChange("search", search)
  }

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      search: "",
      category: "",
      minPrice: undefined,
      maxPrice: undefined,
    })
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Solar Equipment Store</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover premium solar panels, inverters, batteries, and accessories for your renewable energy journey
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              defaultValue={filters.search}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-4 py-1.5 rounded-md hover:bg-purple-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>

            {(filters.search || filters.category || filters.minPrice || filters.maxPrice) && (
              <button onClick={clearFilters} className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                Clear all filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{pagination.total} products found</span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-purple-100 text-primary" : "text-gray-400 hover:text-gray-600"}`}
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-purple-100 text-primary" : "text-gray-400 hover:text-gray-600"}`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-6 p-6 bg-white border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={filters.category || ""}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price
                </label>
                <input
                  type="number"
                  id="minPrice"
                  min="0"
                  step="0.01"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value ? Number.parseFloat(e.target.value) : undefined)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="$0"
                />
              </div>

              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price
                </label>
                <input
                  type="number"
                  id="maxPrice"
                  min="0"
                  step="0.01"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value ? Number.parseFloat(e.target.value) : undefined)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="$10000"
                />
              </div>

              <div>
                <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-2">
                  Per Page
                </label>
                <select
                  id="limit"
                  value={filters.limit}
                  onChange={(e) => handleFilterChange("limit", Number.parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <ErrorMessage message={error} onRetry={fetchProducts} />}

      {/* Products Grid/List */}
      {!error && (
        <>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <button onClick={clearFilters} className="mt-4 text-primary hover:text-purple-700 font-medium">
                Clear filters to see all products
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              }`}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
            <button
       onClick={() => handleFilterChange("page", pagination.page - 1)}
        disabled={pagination.page === 1}
       className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
     >
  <ChevronLeft className="h-4 w-4" />
  Previous
</button>


              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                   <button
                 key={page}
            onClick={() => handleFilterChange("page", page)}
          className={`px-3 py-2 rounded-md cursor-pointer ${
        pagination.page === page
        ? "bg-accent text-white"      
         : "border border-gray-300 hover:bg-gray-50 text-gray-700" 
  }`}
>
  {page}
</button>

                  )
                })}
              </div>

             <button
     onClick={() => handleFilterChange("page", pagination.page + 1)}
      disabled={pagination.page === pagination.totalPages}
       className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
      >
     Next
  <ChevronRight className="h-4 w-4" />
</button>

            </div>
          )}
        </>
      )}

      {/* Loading overlay for filter changes */}
      {loading && products.length > 0 && (
       <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <LoadingSpinner />
  </div>
</div>

      )}
    </div>
  )
}

export default ProductCatalog
