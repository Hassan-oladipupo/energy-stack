import type { Request, Response, NextFunction } from "express"
import { logger } from "../utils/logger"

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()

  logger.info("Request started", {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  })

  res.on("finish", () => {
    const duration = Date.now() - start
    const level = res.statusCode >= 400 ? "error" : "info"

    logger.log(level, "Request completed", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    })
  })

  next()
}
