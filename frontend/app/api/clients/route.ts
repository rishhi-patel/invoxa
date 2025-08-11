import { NextResponse } from "next/server"
import { authHeader, json, errorJson } from "../_utils/auth"
import { api } from "@/lib/http"

const BASE = process.env.CLIENT_SERVICE_URL!

// GET /api/clients?search=... (optional passthrough)
export async function GET(req: Request) {
  const url = new URL(req.url)
  const search = url.searchParams.get("search")
  const target = search
    ? `${BASE}/api/clients?search=${encodeURIComponent(search)}`
    : `${BASE}/api/clients`

  try {
    const data = await api(target, { headers: await authHeader() })
    return NextResponse.json(data)
  } catch (e: any) {
    const { status, body } = errorJson(e)
    return new NextResponse(body, { status })
  }
}

// POST /api/clients
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = await api(`${BASE}/api/clients`, {
      method: "POST",
      headers: await authHeader(),
      ...json(body),
    })
    return NextResponse.json(data, { status: 201 })
  } catch (e: any) {
    const { status, body } = errorJson(e)
    return new NextResponse(body, { status })
  }
}
