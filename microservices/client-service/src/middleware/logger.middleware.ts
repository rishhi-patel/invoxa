import { Request, Response, NextFunction } from "express"
import { logger } from "../utils/logger"

export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  logger.info(`${req.method} ${req.originalUrl}`)
  next()
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error("Unhandled error in request", err)
  res.status(500).json({ error: "Internal Server Error" })
}
