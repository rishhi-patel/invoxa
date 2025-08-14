import { Router } from "express"
import { login, register, validate } from "../controllers/auth.controller"

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.get("/validate", validate)

export default router
