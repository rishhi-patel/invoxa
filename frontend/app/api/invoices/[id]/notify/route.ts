import { NextResponse } from "next/server"
import { authHeader, errorJson } from "../../../_utils/auth"
import { api } from "@/lib/http"

const BASE = process.env.INVOICE_SERVICE_URL!

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const data = await api(`${BASE}/api/invoices/${params.id}/notify`, {
      method: "POST",
      headers: await authHeader(),
    })
    return NextResponse.json(data)
  } catch (e: any) {
    const { status, body } = errorJson(e)
    return new NextResponse(body, { status })
  }
}
