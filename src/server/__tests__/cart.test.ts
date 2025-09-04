import request from "supertest"
import app from "../index"
import { Product } from "../models"

describe("Cart API", () => {
  let product: any
  const sessionId = "test-session-123"

  beforeEach(async () => {
    product = await Product.create({
      name: "Test Solar Panel",
      description: "A test solar panel",
      price: 299.99,
      category: "solar-panels",
      stock: 10,
      images: ["test.jpg"],
    })
  })

  describe("POST /api/cart/:sessionId", () => {
    it("should add item to cart", async () => {
      const response = await request(app)
        .post(`/api/cart/${sessionId}`)
        .send({
          productId: product.getDataValue("id"),
          quantity: 2,
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.items).toHaveLength(1)
      expect(response.body.data.items[0].quantity).toBe(2)
    })

    it("should return error for insufficient stock", async () => {
      const response = await request(app)
        .post(`/api/cart/${sessionId}`)
        .send({
          productId: product.getDataValue("id"),
          quantity: 15, // More than available stock
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe("Insufficient stock")
    })
  })

  describe("GET /api/cart/:sessionId", () => {
    it("should return empty cart for new session", async () => {
      const response = await request(app).get(`/api/cart/${sessionId}`).expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.items).toHaveLength(0)
    })
  })
})
