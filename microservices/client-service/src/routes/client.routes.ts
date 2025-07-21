import express from "express"
import { v4 as uuidv4 } from "uuid"
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
} from "../services/client.service"

const router = express.Router()

// Create new client
router.post("/", async (req, res) => {
  const client = { id: uuidv4(), ...req.body }
  try {
    await createClient(client)
    res.status(201).json(client)
  } catch (err) {
    res.status(500).json({ error: "Failed to create client" })
  }
})

// Get all clients
router.get("/", async (_req, res) => {
  try {
    const data = await getAllClients()
    res.json(data.Items)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch clients" })
  }
})

// Get client by ID
router.get("/:id", async (req, res) => {
  try {
    const data = await getClientById(req.params.id)
    if (!data.Item) return res.status(404).json({ error: "Not found" })
    res.json(data.Item)
  } catch (err) {
    res.status(500).json({ error: "Failed to get client" })
  }
})

// Update client
router.put("/:id", async (req, res) => {
  try {
    const data = await updateClient(req.params.id, req.body)
    res.json(data.Attributes)
  } catch (err) {
    res.status(500).json({ error: "Failed to update client" })
  }
})

// Delete client
router.delete("/:id", async (req, res) => {
  try {
    await deleteClient(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: "Failed to delete client" })
  }
})

export default router
