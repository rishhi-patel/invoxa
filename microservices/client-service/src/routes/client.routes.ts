import { Router } from "express"
import * as clientService from "../services/client.service"

const router = Router()

router.post("/", clientService.createClient)
router.get("/", clientService.getAllClients)
router.get("/:id", clientService.getClientById)
router.put("/:id", clientService.updateClient)
router.delete("/:id", clientService.deleteClient)

export default router
