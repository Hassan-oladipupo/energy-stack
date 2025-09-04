"use client"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { CartProvider, useCart } from "../../contexts/CartContext"
import * as api from "../../services/api"
// Mock the API
jest.mock("../../services/api")
const mockCartApi = api.cartApi as jest.Mocked<typeof api.cartApi>

// Test component that uses the cart context
const TestComponent = () => {
  const { cart, addToCart, loading, error } = useCart()

  return (
    <div>
      <div data-testid="cart-items">{cart?.items?.length || 0}</div>
      <div data-testid="loading">{loading ? "loading" : "not loading"}</div>
      <div data-testid="error">{error || "no error"}</div>
      <button onClick={() => addToCart(1, 2)}>Add to Cart</button>
    </div>
  )
}

const mockCart = {
  id: 1,
  sessionId: "test-session",
  items: [
    {
      id: 1,
      cartId: 1,
      productId: 1,
      quantity: 2,
      product: {
        id: 1,
        name: "Test Product",
        description: "Test Description",
        price: 100,
        category: "solar-panels",
        stock: 10,
        images: ["test.jpg"],
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  ],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
}

describe("CartContext", () => {
  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => "test-session"),
        setItem: jest.fn(),
      },
      writable: true,
    })

    mockCartApi.getCart.mockResolvedValue({ success: true, data: mockCart })
    mockCartApi.addToCart.mockResolvedValue({ success: true, data: mockCart })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("provides cart context to children", async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId("cart-items")).toHaveTextContent("1")
    })
  })

  it("loads cart on mount", async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
    )

    await waitFor(() => {
      expect(mockCartApi.getCart).toHaveBeenCalledWith("test-session")
    })
  })

  it("handles addToCart action", async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("not loading")
    })

    const addButton = screen.getByText("Add to Cart")
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(mockCartApi.addToCart).toHaveBeenCalledWith("test-session", 1, 2)
    })
  })

  it("handles API errors", async () => {
    mockCartApi.getCart.mockRejectedValue(new Error("API Error"))

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent("Failed to load cart")
    })
  })

  it("generates session ID if not exists", () => {
    const mockGetItem = jest.fn(() => null)
    const mockSetItem = jest.fn()

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
      },
      writable: true,
    })

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
    )

    expect(mockSetItem).toHaveBeenCalledWith("sessionId", expect.stringMatching(/^session_/))
  })
})
