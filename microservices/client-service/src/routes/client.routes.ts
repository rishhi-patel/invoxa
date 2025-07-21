import { Router } from "express"
import * as clientService from "../services/client.service"

const router = Router()

router.post("/", async (req, res) => {
  try {
    const newClient = await clientService.createClient(req.body)
    res.status(201).json(newClient)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to create client" })
  }
})

router.get("/", async (_req, res) => {
  try {
    const clients = await clientService.getAllClients()
    res.json(clients)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch clients" })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const client = await clientService.getClientById(req.params.id)
    if (!client) return res.status(404).json({ error: "Client not found" })
    res.json(client)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch client" })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const updated = await clientService.updateClient(req.params.id, req.body)
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: "Failed to update client" })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    await clientService.deleteClient(req.params.id)
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: "Failed to delete client" })
  }
})

export default router
