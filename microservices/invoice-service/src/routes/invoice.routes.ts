import { Router } from "express"
import { authenticate } from "../middleware/auth.middleware"
import {
  createInvoice,
  listInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  notifyInvoice,
} from "../controllers/invoice.controller"

const router = Router()
router.use(authenticate)

router.post("/", createInvoice)
router.get("/", listInvoices)
router.get("/:id", getInvoiceById)
router.put("/:id", updateInvoice)
router.delete("/:id", deleteInvoice)
router.post("/:id/notify", notifyInvoice)

export default router
