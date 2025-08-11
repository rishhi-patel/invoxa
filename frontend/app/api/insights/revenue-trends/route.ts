import { NextResponse } from "next/server"
import { authHeader, errorJson } from "../../_utils/auth"
import { api } from "@/lib/http"

const BASE = process.env.INSIGHTS_SERVICE_URL!

export async function GET(req: Request) {
  const url = new URL(req.url)
  const months = url.searchParams.get("months") || "6"
  try {
    const headers = await authHeader()
    const data = await api(
      `${BASE}/api/insights/revenue-trends?months=${encodeURIComponent(
        months
      )}`,
      { headers }
    )
    return NextResponse.json(data)
  } catch (e: any) {
    const { status, body } = errorJson(e)
    return new NextResponse(body, { status })
  }
}
