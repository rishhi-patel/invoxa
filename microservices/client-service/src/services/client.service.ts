import { ClientModel } from "../models/client.model"

export const createClient = async (data: any) => {
  try {
    const client = new ClientModel(data)
    return await client.save()
  } catch (error) {
    throw new Error(`Failed to create client: ${error}`)
  }
}

export const getAllClients = async () => {
  try {
    return await ClientModel.find()
  } catch (error) {
    throw new Error(`Failed to fetch clients: ${error}`)
  }
}

export const getClientById = async (id: string) => {
  try {
    const client = await ClientModel.findById(id)
    if (!client) {
      throw new Error("Client not found")
    }
    return client
  } catch (error) {
    throw new Error(`Failed to fetch client: ${error}`)
  }
}

export const updateClient = async (id: string, updates: any) => {
  try {
    const updatedClient = await ClientModel.findByIdAndUpdate(id, updates, {
      new: true,
    })
    if (!updatedClient) {
      throw new Error("Client not found")
    }
    return updatedClient
  } catch (error) {
    throw new Error(`Failed to update client: ${error}`)
  }
}

export const deleteClient = async (id: string) => {
  try {
    const deletedClient = await ClientModel.findByIdAndDelete(id)
    if (!deletedClient) {
      throw new Error("Client not found")
    }
    return deletedClient
  } catch (error) {
    throw new Error(`Failed to delete client: ${error}`)
  }
}
