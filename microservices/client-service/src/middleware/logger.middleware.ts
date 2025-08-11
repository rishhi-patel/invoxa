import { Request, Response, NextFunction } from "express"
import chalk from "chalk"

export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  console.log(
    chalk.blue(
      `[INFO] ${new Date().toISOString()} — ${req.method} ${req.originalUrl}`
    )
  )
  next()
}

// put this AFTER routes in index.ts: app.use(errorHandler)
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err?.status || 500
  const message =
    err?.message || (typeof err === "string" ? err : "Internal Server Error")

  // Log full error safely
  console.error("[ERROR]", message, err?.stack ? `\n${err.stack}` : "")

  // Return a consistent JSON payload (no circular objects)
  res.status(status).json({ message })
}
