import { NextResponse } from "next/server"

import { authHeader, errorJson } from "../_utils/auth"
import { api } from "@/lib/http"

const BASE = process.env.INVOICE_SERVICE_URL!

export async function GET() {
  try {
    const auth = await authHeader()
    const data = await api(`${BASE}/api/invoices`, {
      headers: Object.keys(auth).length > 0 ? auth : {},
    })
    return NextResponse.json(data)
  } catch (e: any) {
    const { status, body } = errorJson(e)
    return new NextResponse(body, { status })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = await api(`${BASE}/api/invoices`, {
      method: "POST",
      headers: {
        ...(await authHeader()),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    return NextResponse.json(data, { status: 201 })
  } catch (e: any) {
    const { status, body } = errorJson(e)
    return new NextResponse(body, { status })
  }
}
