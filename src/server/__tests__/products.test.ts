import request from "supertest"
import app from "../index"
import { Product } from "../models"

describe("Products API", () => {
  beforeEach(async () => {
    await Product.create({
      name: "Test Solar Panel",
      description: "A test solar panel",
      price: 299.99,
      category: "solar-panels",
      stock: 10,
      images: ["test.jpg"],
    })
  })

  describe("GET /api/products", () => {
    it("should return products with pagination", async () => {
      const response = await request(app).get("/api/products").expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.pagination).toMatchObject({
        page: 1,
        limit: 12,
        total: 1,
        totalPages: 1,
      })
    })

    it("should filter products by category", async () => {
      const response = await request(app).get("/api/products?category=solar-panels").expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].category).toBe("solar-panels")
    })

    it("should search products by name", async () => {
      const response = await request(app).get("/api/products?search=Solar").expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
    })
  })

  describe("GET /api/products/:id", () => {
    it("should return a single product", async () => {
      const product = await Product.findOne()
      const response = await request(app)
        .get(`/api/products/${product?.getDataValue("id")}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe("Test Solar Panel")
    })

    it("should return 404 for non-existent product", async () => {
      const response = await request(app).get("/api/products/999").expect(404)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe("Product not found")
    })
  })
})
