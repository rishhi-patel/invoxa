import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

const BASE_API_URL =
  process.env.BASE_API_URL || "http://localhost:3001/api/client"
const SERVICE_TOKEN = process.env.SERVICE_TOKEN

export async function fetchClientLite(id: string) {
  const { data } = await axios.get(`${BASE_API_URL}/internal/${id}`, {
    headers: SERVICE_TOKEN ? { "x-service-token": SERVICE_TOKEN } : undefined,
    timeout: 4000,
  })
  return data as { _id: string; name: string; email: string; company?: string }
}
