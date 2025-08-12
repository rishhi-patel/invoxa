import dotenv from "dotenv"
dotenv.config()
import jwt, { SignOptions, VerifyOptions, JwtPayload } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export function encodeJwsToken(payload: object, options?: SignOptions): string {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: "HS256",
    ...(options || {}),
  })
}

export function decodeJwsToken<T = JwtPayload>(
  token: string,
  options?: VerifyOptions
): T | null {
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
      ...(options || {}),
    }) as T
  } catch (err) {
    console.error("JWT verification failed:", err)
    return null
  }
}
