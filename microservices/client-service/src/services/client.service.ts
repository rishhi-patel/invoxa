import { ddbDocClient } from "../utils/dynamo"
import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb"
import { Client } from "../types/client"
import { logger } from "../utils/logger" // 👈 import the logger

const TABLE_NAME = "invoxa_clients"

// ✅ Create a new client
export const createClient = async (client: Client) => {
  try {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: client,
    })
    logger.info(`Creating client: ${client.name}`)
    return await ddbDocClient.send(command)
  } catch (err) {
    logger.error("Failed to create client", err)
    throw err
  }
}

// ✅ Get all clients
export const getAllClients = async () => {
  try {
    logger.info("Fetching all clients")
    const command = new ScanCommand({ TableName: TABLE_NAME })
    return await ddbDocClient.send(command)
  } catch (err) {
    logger.error("Failed to fetch clients", err)
    throw err
  }
}

// ✅ Get a single client by ID
export const getClientById = async (id: string) => {
  try {
    logger.info(`Fetching client with ID: ${id}`)
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    })
    return await ddbDocClient.send(command)
  } catch (err) {
    logger.error(`Failed to fetch client with ID: ${id}`, err)
    throw err
  }
}

// ✅ Update a client by ID
export const updateClient = async (id: string, updates: Partial<Client>) => {
  try {
    logger.info(`Updating client with ID: ${id}`)
    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression:
        "set #name = :name, email = :email, company = :company, phone = :phone",
      ExpressionAttributeNames: {
        "#name": "name",
      },
      ExpressionAttributeValues: {
        ":name": updates.name,
        ":email": updates.email,
        ":company": updates.company,
        ":phone": updates.phone,
      },
      ReturnValues: "ALL_NEW",
    })
    return await ddbDocClient.send(command)
  } catch (err) {
    logger.error(`Failed to update client with ID: ${id}`, err)
    throw err
  }
}

// ✅ Delete a client by ID
export const deleteClient = async (id: string) => {
  try {
    logger.info(`Deleting client with ID: ${id}`)
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id },
    })
    return await ddbDocClient.send(command)
  } catch (err) {
    logger.error(`Failed to delete client with ID: ${id}`, err)
    throw err
  }
}
