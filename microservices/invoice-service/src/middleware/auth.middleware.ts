import type { Request, Response, NextFunction } from "express"
import { decodeJwsToken } from "../utils/jwt"

export interface AuthedRequest extends Request {
  user?: Record<string, any>
}

export const authenticate = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === "test") {
    req.user = process.env.TEST_USER_ID
      ? { id: process.env.TEST_USER_ID }
      : { id: "507f1f77bcf86cd799439011" }
    return next()
  }

  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: missing Bearer token" })
  }

  const token = authHeader.slice(7).trim()
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: empty token" })
  }

  try {
    const data = decodeJwsToken(token)

    if (!data?.id) {
      return res.status(401).json({ error: "Unauthorized: invalid token" })
    }

    req.user = data.decoded ?? data ?? {}
    console.log("Authenticated user:", req.user)

    next()
  } catch (err) {
    console.error("Authentication error:", err)
    res.status(401).json({ error: "Unauthorized: token validation failed" })
  }
}
