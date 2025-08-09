import { Request, Response } from "express"
import { ClientModel } from "../models/client.model"

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: string | any
    }
  }
}

// Helper to check ownership
const isOwner = (client: any, user: any) =>
  client.createdBy?.toString() === user

export const getClientSnapshotById = async (id: string) => {
  return ClientModel.findById(id)
    .select("name email company") // only what invoice-service needs
    .lean() // plain JSON object, no circular refs
}

export const createClient = async (req: Request, res: Response) => {
  try {
    const client = new ClientModel({ ...req.body, createdBy: req.user })
    const savedClient = await client.save()
    res.status(201).json(savedClient)
  } catch (error) {
    res.status(500).json({ message: `Failed to create client: ${error}` })
  }
}

export const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await ClientModel.find({ createdBy: req.user })
    res.json(clients)
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch clients: ${error}` })
  }
}

export const getClientById = async (req: Request, res: Response) => {
  try {
    const client = await ClientModel.findById(req.params.id)
    if (!client) {
      return res.status(404).json({ message: "Client not found" })
    }
    if (!isOwner(client, req.user)) {
      return res.status(403).json({ message: "Forbidden" })
    }
    res.json(client)
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch client: ${error}` })
  }
}

export const updateClient = async (req: Request, res: Response) => {
  try {
    const client = await ClientModel.findById(req.params.id)
    if (!client) {
      return res.status(404).json({ message: "Client not found" })
    }
    if (!isOwner(client, req.user)) {
      return res.status(403).json({ message: "Forbidden" })
    }
    const updatedClient = await ClientModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(updatedClient)
  } catch (error) {
    res.status(500).json({ message: `Failed to update client: ${error}` })
  }
}

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const client = await ClientModel.findById(req.params.id)
    if (!client) {
      return res.status(404).json({ message: "Client not found" })
    }
    if (!isOwner(client, req.user)) {
      return res.status(403).json({ message: "Forbidden" })
    }
    await ClientModel.findByIdAndDelete(req.params.id)
    return res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: `Failed to delete client: ${error}` })
  }
}
