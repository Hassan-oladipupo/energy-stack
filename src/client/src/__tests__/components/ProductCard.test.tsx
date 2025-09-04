import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import ProductCard from "../../components/ProductCard"
import { CartProvider } from "../../contexts/CartContext"
import type { Product } from "../../types"
// Mock the cart context
const mockAddToCart = jest.fn()
jest.mock("../../contexts/CartContext", () => ({
  ...require("../../contexts/CartContext"),
  useCart: () => ({
    addToCart: mockAddToCart,
    loading: false,
  }),
}))

const mockProduct: Product = {
  id: 1,
  name: "Test Solar Panel",
  description: "A high-efficiency solar panel for testing",
  price: 299.99,
  category: "solar-panels",
  stock: 10,
  images: ["test-image.jpg"],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
}

const renderProductCard = (product = mockProduct, viewMode: "grid" | "list" = "grid") => {
  return render(
    <BrowserRouter>
      <CartProvider>
        <ProductCard product={product} viewMode={viewMode} />
      </CartProvider>
    </BrowserRouter>,
  )
}

describe("ProductCard", () => {
  beforeEach(() => {
    mockAddToCart.mockClear()
  })

  it("renders product information correctly", () => {
    renderProductCard()

    expect(screen.getByText("Test Solar Panel")).toBeInTheDocument()
    expect(screen.getByText(/A high-efficiency solar panel/)).toBeInTheDocument()
    expect(screen.getByText("$299.99")).toBeInTheDocument()
    expect(screen.getByText("Solar Panels")).toBeInTheDocument()
  })

  it("shows stock information", () => {
    renderProductCard()
    expect(screen.getByText("10 left")).toBeInTheDocument()
  })

  it("shows out of stock when stock is 0", () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    renderProductCard(outOfStockProduct)
    expect(screen.getByText("Out of stock")).toBeInTheDocument()
  })

  it("calls addToCart when add button is clicked", async () => {
    renderProductCard()

    const addButton = screen.getByRole("button", { name: /add/i })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith(1, 1)
    })
  })

  it("disables add button when out of stock", () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    renderProductCard(outOfStockProduct)

    const addButton = screen.getByRole("button", { name: /add/i })
    expect(addButton).toBeDisabled()
  })

  it("renders differently in list view", () => {
    renderProductCard(mockProduct, "list")

    // In list view, the layout should be different
    expect(screen.getByText("Test Solar Panel")).toBeInTheDocument()
    expect(screen.getByText("Add to Cart")).toBeInTheDocument()
  })

  it("links to product detail page", () => {
    renderProductCard()

    const productLink = screen.getByRole("link")
    expect(productLink).toHaveAttribute("href", "/products/1")
  })
})
