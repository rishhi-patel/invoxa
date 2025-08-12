import { NextResponse } from "next/server"
import { authFrom, json, errorJson } from "../_utils/auth"
import { forward } from "@/lib/fetcher"

const BASE = process.env.CLIENT_SERVICE_URL!

// GET /api/clients?search=... (optional passthrough)
export async function GET(req: Request) {
  const url = new URL(req.url)
  const search = url.searchParams.get("search")
  const target = search
    ? `${BASE}/api/clients?search=${encodeURIComponent(search)}`
    : `${BASE}/api/clients`

  try {
    const data = await forward(target, { headers: authFrom(req) })
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
    const data = await forward(`${BASE}/api/clients`, {
      method: "POST",
      headers: authFrom(req),
      ...json(body),
    })
    return NextResponse.json(data, { status: 201 })
  } catch (e: any) {
    const { status, body } = errorJson(e)
    return new NextResponse(body, { status })
  }
}
