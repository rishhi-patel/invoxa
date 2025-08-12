import { NextResponse } from "next/server"

import { authFrom, errorJson } from "../_utils/auth"
import { forward } from "@/lib/fetcher"

const BASE = process.env.INVOICE_SERVICE_URL!

export async function GET(req: Request) {
  try {
    const auth = authFrom(req)
    const data = await forward(`${BASE}/api/invoices`, {
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
    const data = await forward(`${BASE}/api/invoices`, {
      method: "POST",
      headers: {
        ...authFrom(req),
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
