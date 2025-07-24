import { Request, Response } from "express"
import { ClientModel } from "../models/client.model"

export const createClient = async (req: Request, res: Response) => {
  try {
    const client = new ClientModel(req.body)
    const savedClient = await client.save()
    res.status(201).json(savedClient)
  } catch (error) {
    res.status(500).json({ message: `Failed to create client: ${error}` })
  }
}

export const getAllClients = async (_req: Request, res: Response) => {
  try {
    const clients = await ClientModel.find()
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
    res.json(client)
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch client: ${error}` })
  }
}

export const updateClient = async (req: Request, res: Response) => {
  try {
    const updatedClient = await ClientModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" })
    }
    res.json(updatedClient)
  } catch (error) {
    res.status(500).json({ message: `Failed to update client: ${error}` })
  }
}

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const deletedClient = await ClientModel.findByIdAndDelete(req.params.id)
    if (!deletedClient) {
      return res.status(404).json({ message: "Client not found" })
    }
    return res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: `Failed to delete client: ${error}` })
  }
}
