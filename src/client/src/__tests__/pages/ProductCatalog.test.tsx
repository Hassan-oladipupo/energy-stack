import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import ProductCatalog from "../../pages/ProductCatalog"
import { CartProvider } from "../../contexts/CartContext"
import * as api from "../../services/api"
// Remove incorrect jest import

// Mock the API
jest.mock("../../services/api")
const mockProductApi = api.productApi as jest.Mocked<typeof api.productApi>

const mockProducts = [
  {
    id: 1,
    name: "Solar Panel 1",
    description: "Description 1",
    price: 299.99,
    category: "solar-panels",
    stock: 10,
    images: ["image1.jpg"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Inverter 1",
    description: "Description 2",
    price: 599.99,
    category: "inverters",
    stock: 5,
    images: ["image2.jpg"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

const mockResponse = {
  success: true,
  data: mockProducts,
  pagination: {
    page: 1,
    limit: 12,
    total: 2,
    totalPages: 1,
  },
}

const renderProductCatalog = () => {
  return render(
    <BrowserRouter>
      <CartProvider>
        <ProductCatalog />
      </CartProvider>
    </BrowserRouter>,
  )
}

describe("ProductCatalog", () => {
  beforeEach(() => {
    mockProductApi.getProducts.mockResolvedValue(mockResponse)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders product catalog with products", async () => {
    renderProductCatalog()

    await waitFor(() => {
      expect(screen.getByText("Solar Panel 1")).toBeInTheDocument()
      expect(screen.getByText("Inverter 1")).toBeInTheDocument()
    })

    expect(screen.getByText("2 products found")).toBeInTheDocument()
  })

  it("shows loading spinner initially", () => {
    renderProductCatalog()
    expect(screen.getByRole("status", { hidden: true })).toBeInTheDocument()
  })

  it("handles search functionality", async () => {
    renderProductCatalog()

    await waitFor(() => {
      expect(screen.getByText("Solar Panel 1")).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText("Search products...")
    const searchButton = screen.getByRole("button", { name: /search/i })

    fireEvent.change(searchInput, { target: { value: "solar" } })
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(mockProductApi.getProducts).toHaveBeenCalledWith(expect.objectContaining({ search: "solar" }))
    })
  })

  it("handles category filtering", async () => {
    renderProductCatalog()

    await waitFor(() => {
      expect(screen.getByText("Solar Panel 1")).toBeInTheDocument()
    })

    const filtersButton = screen.getByText("Filters")
    fireEvent.click(filtersButton)

    const categorySelect = screen.getByLabelText("Category")
    fireEvent.change(categorySelect, { target: { value: "solar-panels" } })

    await waitFor(() => {
      expect(mockProductApi.getProducts).toHaveBeenCalledWith(expect.objectContaining({ category: "solar-panels" }))
    })
  })

  it("toggles between grid and list view", async () => {
    renderProductCatalog()

    await waitFor(() => {
      expect(screen.getByText("Solar Panel 1")).toBeInTheDocument()
    })

    const listViewButton = screen.getByLabelText("List view")
    fireEvent.click(listViewButton)

    // Check if view mode changed (this would require checking the component state or DOM structure)
    expect(listViewButton).toHaveClass("bg-purple-100")
  })

  it("shows empty state when no products found", async () => {
    mockProductApi.getProducts.mockResolvedValue({
      success: true,
      data: [],
      pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
    })

    renderProductCatalog()

    await waitFor(() => {
      expect(screen.getByText("No products found matching your criteria.")).toBeInTheDocument()
    })
  })

  it("handles API errors gracefully", async () => {
    mockProductApi.getProducts.mockRejectedValue(new Error("API Error"))

    renderProductCatalog()

    await waitFor(() => {
      expect(screen.getByText(/Failed to load products/)).toBeInTheDocument()
    })
  })
})
