// client-service/src/routes/client.routes.ts
import { Router } from "express"
import { serviceAuth } from "../middleware/serviceAuth"
import { getClientSnapshotById } from "../services/client.service"
import * as clientService from "../services/client.service"
import { authenticate } from "../middleware/auth.middleware"

const router = Router()

// 🔒 Internal snapshot fetch for other services
router.get("/internal/:id", serviceAuth, async (req, res) => {
  try {
    const client = await getClientSnapshotById(req.params.id)
    if (!client) {
      return res.status(404).json({ message: "Client not found" })
    }
    // return minimal, lean object — safe to stringify
    // Exclude _id from client to avoid duplicate keys
    const { _id, ...clientWithoutId } = client || {}
    return res.json({ _id: req.params.id, ...clientWithoutId })
  } catch (err) {
    // log the full error, but don't send the raw Error (it’s circular)
    console.error("Error fetching client snapshot:", err)
    return res.status(500).json({ message: "Failed to fetch client" })
  }
})

router.post("/", authenticate, clientService.createClient)
router.get("/", authenticate, clientService.getAllClients)
router.get("/:id", authenticate, clientService.getClientById)
router.put("/:id", authenticate, clientService.updateClient)
router.delete("/:id", authenticate, clientService.deleteClient)

export default router
