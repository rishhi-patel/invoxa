import { Request, Response, NextFunction } from "express"
import bcrypt from "bcrypt"
import { UserModel } from "../models/user.model"
import { decodeJwsToken, encodeJwsToken } from "../utils/jwt"

const JWT_SECRET = process.env.JWT_SECRET || "secret123"

// Centralized error handler
const handleError = (
  res: Response,
  error: unknown,
  message = "Internal server error",
  status = 500
) => {
  console.error(error)
  res
    .status(status)
    .json({ message, error: error instanceof Error ? error.message : error })
}

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const existing = await UserModel.findOne({ email })
    if (existing)
      return res.status(400).json({ message: "User already exists" })

    const hashed = await bcrypt.hash(password, 10)
    const user = new UserModel({ email, password: hashed })
    await user.save()
    const payload = { id: user._id, email: user.email }
    const token = encodeJwsToken(payload)

    res.status(201).json({ token, message: "User registered successfully" })
  } catch (err) {
    handleError(res, err, "Registration failed")
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await UserModel.findOne({ email })
    if (!user) return res.status(401).json({ message: "Invalid credentials" })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: "Invalid credentials" })

    const token = encodeJwsToken({ id: user._id, email: user.email })
    res.json({ token })
  } catch (err) {
    handleError(res, err, "Login failed")
  }
}

export const validate = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ message: "Token required" })

  try {
    const decoded = decodeJwsToken(token)
    res.json({ valid: Boolean(decoded?.id), decoded })
  } catch (err) {
    handleError(res, err, "Token validation failed", 401)
  }
}
