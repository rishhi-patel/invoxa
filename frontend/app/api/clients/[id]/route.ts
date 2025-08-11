import { NextResponse } from "next/server"
import { authHeader, json, errorJson } from "../../_utils/auth"
import { api } from "@/lib/http"

const BASE = process.env.CLIENT_SERVICE_URL!

type Ctx = { params: { id: string } }

// GET /api/clients/:id
export async function GET(_: Request, { params }: Ctx) {
  try {
    const data = await api(`${BASE}/api/clients/${params.id}`, {
      headers: await authHeader(),
    })
    return NextResponse.json(data)
  } catch (e: any) {
    const { status, body } = errorJson(e)
    return new NextResponse(body, { status })
  }
}

// PUT /api/clients/:id
export async function PUT(req: Request, { params }: Ctx) {
  try {
    const body = await req.json()
    const data = await api(`${BASE}/api/clients/${params.id}`, {
      method: "PUT",
      headers: await authHeader(),
      ...json(body),
    })
    return NextResponse.json(data)
  } catch (e: any) {
    const { status, body } = errorJson(e)
    return new NextResponse(body, { status })
  }
}

// DELETE /api/clients/:id
export async function DELETE(_: Request, { params }: Ctx) {
  try {
    await api(`${BASE}/api/clients/${params.id}`, {
      method: "DELETE",
      headers: await authHeader(),
    })
    return new NextResponse(null, { status: 204 })
  } catch (e: any) {
    const { status, body } = errorJson(e)
    return new NextResponse(body, { status })
  }
}
