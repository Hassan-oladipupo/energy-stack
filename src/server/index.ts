import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { sequelize } from "./models/index"
import { logger } from "./utils/logger"
import { errorHandler } from "./middleware/errorHandler"
import { requestLogger } from "./middleware/requestLogger"
import productRoutes from "./routes/products"
import cartRoutes from "./routes/cart"
import orderRoutes from "./routes/orders"

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(",") || ["http://localhost:3000"],
    credentials: true,
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})
app.use("/api", limiter)

// Body parsing
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Request logging
app.use(requestLogger)

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// API routes
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)

// OpenAPI documentation
app.get("/api/docs", (_req, res) => {
  res.json({
    openapi: "3.0.0",
    info: {
      title: "EnergyStack Storefront API",
      version: "1.0.0",
      description: "Solar equipment storefront API with cart and order management",
    },
    servers: [{ url: "http://localhost:3001", description: "Development server" }],
    paths: {
      "/api/products": {
        get: {
          summary: "Get products with pagination and filtering",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 12 } },
            { name: "search", in: "query", schema: { type: "string" } },
            { name: "category", in: "query", schema: { type: "string" } },
            { name: "minPrice", in: "query", schema: { type: "number" } },
            { name: "maxPrice", in: "query", schema: { type: "number" } },
          ],
        },
      },
      "/api/products/{id}": {
        get: {
          summary: "Get product by ID",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        },
      },
      "/api/cart/{sessionId}": {
        get: { summary: "Get cart by session ID" },
        post: { summary: "Add item to cart" },
        put: { summary: "Update cart item quantity" },
        delete: { summary: "Remove item from cart" },
      },
      "/api/orders": {
        post: { summary: "Create order from cart" },
      },
      "/api/orders/{id}": {
        get: { summary: "Get order by ID" },
      },
    },
  })
})

// Error handling
app.use(errorHandler)

// 404 handler
app.use("*", (_req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  })
})

// Start server
async function startServer() {
  try {
    await sequelize.authenticate()
    logger.info("Database connection established successfully")

    await sequelize.sync({ force: false })
    logger.info("Database synchronized")

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
      logger.info(`API documentation available at http://localhost:${PORT}/api/docs`)
    })
  } catch (error) {
    logger.error("Unable to start server:", error)
    process.exit(1)
  }
}

startServer()

export default app
