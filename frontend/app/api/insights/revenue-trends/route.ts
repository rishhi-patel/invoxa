import { NextResponse } from "next/server"
import { authFrom, errorJson } from "../../_utils/auth"
import { forward } from "@/lib/fetcher"

const BASE = process.env.BASE_API_URL!

export async function GET(req: Request) {
  const url = new URL(req.url)
  const months = url.searchParams.get("months") || "6"
  try {
    const headers = authFrom(req)
    const data = await forward(
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
