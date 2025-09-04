import type { Request, Response, NextFunction } from "express"
import { body, param, query, validationResult } from "express-validator"
import { createError } from "./errorHandler"

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ")
    throw createError(`Validation error: ${errorMessages}`, 400)
  }
  next()
}

export const validateProductQuery = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  query("search").optional().isLength({ min: 1, max: 100 }).withMessage("Search must be 1-100 characters"),
  query("category")
    .optional()
    .isIn(["solar-panels", "inverters", "batteries", "accessories"])
    .withMessage("Invalid category"),
  query("minPrice").optional().isFloat({ min: 0 }).withMessage("Min price must be non-negative"),
  query("maxPrice").optional().isFloat({ min: 0 }).withMessage("Max price must be non-negative"),
  handleValidationErrors,
]

export const validateProductId = [
  param("id").isInt({ min: 1 }).withMessage("Product ID must be a positive integer"),
  handleValidationErrors,
]

export const validateAddToCart = [
  body("productId").isInt({ min: 1 }).withMessage("Product ID must be a positive integer"),
  body("quantity").isInt({ min: 1, max: 100 }).withMessage("Quantity must be between 1 and 100"),
  handleValidationErrors,
]

export const validateUpdateCartItem = [
  body("quantity").isInt({ min: 0, max: 100 }).withMessage("Quantity must be between 0 and 100"),
  handleValidationErrors,
]

export const validateSessionId = [
  param("sessionId").isLength({ min: 1, max: 255 }).withMessage("Session ID is required"),
  handleValidationErrors,
]
