import { Router, Request, Response, NextFunction } from "express";
import { Op } from "sequelize"
import { Product } from "../models"
import { validateProductQuery, validateProductId } from "../middleware/validation"
import { createError } from "../middleware/errorHandler"
import { logger } from "../utils/logger"

const router = Router()

// GET /api/products - List products with pagination and filtering
router.get("/", validateProductQuery, async (
    req: Request<{ sessionId: string }>,
    res: Response,
    next: NextFunction
  )  => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 12
    const search = req.query.search as string
    const category = req.query.category as string
    const minPrice = Number.parseFloat(req.query.minPrice as string)
    const maxPrice = Number.parseFloat(req.query.maxPrice as string)

    const offset = (page - 1) * limit
    const where: any = {}

    // Search filter
    if (search) {
      where[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }, { description: { [Op.iLike]: `%${search}%` } }]
    }

    // Category filter
    if (category) {
      where.category = category
    }

    // Price range filter
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      where.price = {}
      if (!isNaN(minPrice)) where.price[Op.gte] = minPrice
      if (!isNaN(maxPrice)) where.price[Op.lte] = maxPrice
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    })

    const totalPages = Math.ceil(count / limit)

    logger.info("Products fetched", {
      page,
      limit,
      total: count,
      filters: { search, category, minPrice, maxPrice },
    })

    res.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
      },
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/products/:id - Get single product
router.get("/:id", validateProductId, async (
    req: Request<{ id: string; sessionId: string }>,
    res: Response,
    next: NextFunction
  )  => {
  try {
    const product = await Product.findByPk(req.params.id)

    if (!product) {
      throw createError("Product not found", 404)
    }

    logger.info("Product fetched", { productId: req.params.id })

    res.json({
      success: true,
      data: product,
    })
  } catch (error) {
    next(error)
  }
})

export default router
