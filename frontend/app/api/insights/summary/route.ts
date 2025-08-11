import { NextResponse } from "next/server"
import { authHeader, errorJson } from "../../_utils/auth"
import { api } from "@/lib/http"

const BASE = process.env.INSIGHTS_SERVICE_URL!

export async function GET() {
  try {
    const data = await api(`${BASE}/api/insights/summary`, {
      headers: await authHeader(),
    })
    return NextResponse.json(data)
  } catch (e: any) {
    const { status, body } = errorJson(e)
    return new NextResponse(body, { status })
  }
}
