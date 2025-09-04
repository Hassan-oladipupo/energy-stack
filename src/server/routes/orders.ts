import { Router, Request, Response, NextFunction } from "express";
import { sequelize, Order, OrderItem, Cart, CartItem, Product } from "../models"
import { createError } from "../middleware/errorHandler"
import { logger } from "../utils/logger"

const router = Router()

// POST /api/orders - Create order from cart
router.post("/", async (
    req: Request<{ sessionId: string }>,
    res: Response,
    next: NextFunction
  )  => {
  const transaction = await sequelize.transaction()

  try {
    const { sessionId } = req.body

    if (!sessionId) {
      throw createError("Session ID is required", 400)
    }

    // Get cart with items
    const cart = await Cart.findOne({
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
      transaction,
    })

    if (!cart || !cart.getDataValue("items") || cart.getDataValue("items").length === 0) {
      throw createError("Cart is empty", 400)
    }

    const cartItems = cart.getDataValue("items")
    let subtotal = 0

    // Validate stock and calculate subtotal
    for (const item of cartItems) {
      const product = item.getDataValue("product")
      const quantity = item.getDataValue("quantity")

      if (product.getDataValue("stock") < quantity) {
        throw createError(`Insufficient stock for ${product.getDataValue("name")}`, 400)
      }

      subtotal += Number.parseFloat(product.getDataValue("price")) * quantity
    }

    // Calculate tax (8% default)
    const taxRate = Number.parseFloat(process.env.TAX_RATE || "0.08")
    const tax = subtotal * taxRate
    const total = subtotal + tax

    // Create order
    const order = await Order.create(
      {
        sessionId,
        status: "pending",
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
      },
      { transaction },
    )

    // Create order items and update product stock
    for (const item of cartItems) {
      const product = item.getDataValue("product")
      const quantity = item.getDataValue("quantity")
      const price = product.getDataValue("price")

      await OrderItem.create(
        {
          orderId: order.getDataValue("id"),
          productId: product.getDataValue("id"),
          quantity,
          price,
        },
        { transaction },
      )

      // Update product stock
      await product.update(
        {
          stock: product.getDataValue("stock") - quantity,
        },
        { transaction },
      )
    }

    // Clear cart
    await CartItem.destroy({
      where: { cartId: cart.getDataValue("id") },
      transaction,
    })

    // Mark order as placed
    await order.update({ status: "placed" }, { transaction })

    await transaction.commit()

    // Fetch complete order with items
    const completeOrder = await Order.findByPk(order.getDataValue("id"), {
      include: [
        {
          model: OrderItem,
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

    logger.info("Order created", {
      orderId: order.getDataValue("id"),
      sessionId,
      total,
      itemCount: cartItems.length,
    })

    res.status(201).json({
      success: true,
      data: completeOrder,
      message: "Order created successfully",
    })
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
})

// GET /api/orders/:id - Get order by ID
router.get("/:id", async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  )  => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
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

    if (!order) {
      throw createError("Order not found", 404)
    }

    logger.info("Order fetched", { orderId: req.params.id })

    res.json({
      success: true,
      data: order,
    })
  } catch (error) {
    next(error)
  }
})

export default router
