import { Request, Response } from "express"
import { ClientModel } from "../models/client.model"

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: { id: string } | any
    }
  }
}

// Helper to check ownership
const isOwner = (client: any, userId: string) =>
  client.createdBy?.toString() === userId

// Helper to get client by id and check ownership
const getClientIfOwner = async (req: Request) => {
  const client = await ClientModel.findById(req.params.id)
  if (!client) {
    const error: any = new Error("Client not found")
    error.status = 404
    throw error
  }
  if (!isOwner(client, req.user.id)) {
    const error: any = new Error("Forbidden")
    error.status = 403
    throw error
  }
  return client
}

export const getClientSnapshotById = async (id: string) => {
  return ClientModel.findById(id).select("name email company").lean()
}

export const createClient = async (req: Request, res: Response) => {
  try {
    const client = new ClientModel({ ...req.body, createdBy: req.user.id })
    const savedClient = await client.save()
    res.status(201).json(savedClient)
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to create client: ${(error as Error).message}` })
  }
}

export const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await ClientModel.find({ createdBy: req.user.id })
    res.json(clients)
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to fetch clients: ${(error as Error).message}` })
  }
}

export const getClientById = async (req: Request, res: Response) => {
  try {
    const client = await getClientIfOwner(req)
    res.json(client)
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message })
  }
}

export const updateClient = async (req: Request, res: Response) => {
  try {
    await getClientIfOwner(req)
    const updatedClient = await ClientModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(updatedClient)
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message })
  }
}

export const deleteClient = async (req: Request, res: Response) => {
  try {
    await getClientIfOwner(req)
    await ClientModel.findByIdAndDelete(req.params.id)
    return res.status(204).send()
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message })
  }
}
