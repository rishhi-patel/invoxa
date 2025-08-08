import { Router } from "express"
import { authenticate } from "../middleware/auth.middleware"
import {
  createInvoice,
  listInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoice.controller"

const router = Router()

// Protect all invoice routes
router.use(authenticate)

router.post("/", createInvoice)
router.get("/", listInvoices)
router.get("/:id", getInvoiceById)
router.put("/:id", updateInvoice)
router.delete("/:id", deleteInvoice)

export default router
