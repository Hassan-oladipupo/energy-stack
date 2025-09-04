import { Router, Request, Response, NextFunction } from "express";
import { Cart, CartItem, Product } from "../models"
import { validateAddToCart, validateUpdateCartItem, validateSessionId } from "../middleware/validation"
import { createError } from "../middleware/errorHandler"
import { logger } from "../utils/logger"

const router = Router()

// GET /api/cart/:sessionId - Get cart by session ID
router.get("/:sessionId", validateSessionId, async (
    req: Request<{ sessionId: string }>,
    res: Response,
    next: NextFunction
  )  => {
  try {
    const { sessionId } = req.params

    let cart = await Cart.findOne({
      where: { sessionId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
    })

    if (!cart) {
      cart = await Cart.create({ sessionId })
      cart.setDataValue("items", [])
    }

    logger.info("Cart fetched", { sessionId, itemCount: cart.getDataValue("items")?.length || 0 })

    res.json({
      success: true,
      data: cart,
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/cart/:sessionId - Add item to cart
router.post("/:sessionId", validateSessionId, validateAddToCart,async (
    req: Request<{ sessionId: string }>,
    res: Response,
    next: NextFunction
  )  => {
  try {
    const { sessionId } = req.params
    const { productId, quantity } = req.body

    // Check if product exists and has sufficient stock
    const product = await Product.findByPk(productId)
    if (!product) {
      throw createError("Product not found", 404)
    }

    if (product.getDataValue("stock") < quantity) {
      throw createError("Insufficient stock", 400)
    }

    // Get or create cart
    let cart = await Cart.findOne({ where: { sessionId } })
    if (!cart) {
      cart = await Cart.create({ sessionId })
    }

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      where: { cartId: cart.getDataValue("id"), productId },
    })

    if (cartItem) {
      const newQuantity = cartItem.getDataValue("quantity") + quantity
      if (product.getDataValue("stock") < newQuantity) {
        throw createError("Insufficient stock for requested quantity", 400)
      }
      await cartItem.update({ quantity: newQuantity })
    } else {
      cartItem = await CartItem.create({
        cartId: cart.getDataValue("id"),
        productId,
        quantity,
      })
    }

    // Fetch updated cart with items
    const updatedCart = await Cart.findOne({
      where: { sessionId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
    })

    logger.info("Item added to cart", { sessionId, productId, quantity })

    res.json({
      success: true,
      data: updatedCart,
      message: "Item added to cart",
    })
  } catch (error) {
    next(error)
  }
})

// PUT /api/cart/:sessionId/items/:itemId - Update cart item quantity
router.put("/:sessionId/items/:itemId", validateSessionId, validateUpdateCartItem, async (
    req: Request<{ sessionId: string; itemId: string }>,
    res: Response,
    next: NextFunction
  )  => {
  try {
    const { sessionId, itemId } = req.params
    const { quantity } = req.body

    const cart = await Cart.findOne({ where: { sessionId } })
    if (!cart) {
      throw createError("Cart not found", 404)
    }

    const cartItem = await CartItem.findOne({
      where: { id: itemId, cartId: cart.getDataValue("id") },
      include: [{ model: Product, as: "product" }],
    })

    if (!cartItem) {
      throw createError("Cart item not found", 404)
    }

    if (quantity === 0) {
      await cartItem.destroy()
      logger.info("Item removed from cart", { sessionId, itemId })
    } else {
      const product = cartItem.getDataValue("product")
      if (product.getDataValue("stock") < quantity) {
        throw createError("Insufficient stock", 400)
      }
      await cartItem.update({ quantity })
      logger.info("Cart item updated", { sessionId, itemId, quantity })
    }

    // Fetch updated cart
    const updatedCart = await Cart.findOne({
      where: { sessionId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
    })

    res.json({
      success: true,
      data: updatedCart,
      message: quantity === 0 ? "Item removed from cart" : "Cart updated",
    })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/cart/:sessionId/items/:itemId - Remove item from cart
router.delete("/:sessionId/items/:itemId", validateSessionId, async (
    req: Request<{ sessionId: string; itemId: string }>,
    res: Response,
    next: NextFunction
  )  => {
  try {
    const { sessionId, itemId } = req.params

    const cart = await Cart.findOne({ where: { sessionId } })
    if (!cart) {
      throw createError("Cart not found", 404)
    }

    const cartItem = await CartItem.findOne({
      where: { id: itemId, cartId: cart.getDataValue("id") },
    })

    if (!cartItem) {
      throw createError("Cart item not found", 404)
    }

    await cartItem.destroy()

    // Fetch updated cart
    const updatedCart = await Cart.findOne({
      where: { sessionId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
    })

    logger.info("Item removed from cart", { sessionId, itemId })

    res.json({
      success: true,
      data: updatedCart,
      message: "Item removed from cart",
    })
  } catch (error) {
    next(error)
  }
})

export default router
