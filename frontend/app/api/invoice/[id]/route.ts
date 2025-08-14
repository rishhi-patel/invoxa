import { NextResponse } from "next/server"

import { authFrom, json, errorJson } from "../../_utils/auth"
import { forward } from "@/lib/fetcher"

const BASE = process.env.NEXT_PUBLIC_BASE_API_URL!

type Ctx = { params: { id: string } }

export async function GET(_: Request, { params }: Ctx) {
  try {
    const data = await forward(`${BASE}/api/invoice/${params.id}`, {
      headers: authFrom(_),
    })
    return NextResponse.json(data)
  } catch (e: any) {
    const { status, body } = errorJson(e)
    return new NextResponse(body, { status })
  }
}

export async function PUT(req: Request, { params }: Ctx) {
  try {
    const body = await req.json()
    const data = await forward(`${BASE}/api/invoice/${params.id}`, {
      method: "PUT",
      headers: authFrom(req),
      ...json(body),
    })
    return NextResponse.json(data)
  } catch (e: any) {
    const { status, body } = errorJson(e)
    return new NextResponse(body, { status })
  }
}

export async function DELETE(_: Request, { params }: Ctx) {
  try {
    await forward(`${BASE}/api/invoice/${params.id}`, {
      method: "DELETE",
      headers: authFrom(_),
    })
    return new NextResponse(null, { status: 204 })
  } catch (e: any) {
    const { status, body } = errorJson(e)
    return new NextResponse(body, { status })
  }
}
