import { NextResponse } from "next/server"
import { authFrom, errorJson } from "../../_utils/auth"
import { forward } from "@/lib/fetcher"

const BASE = process.env.NEXT_PUBLIC_BASE_API_URL!

export async function GET(req: Request) {
  try {
    const data = await forward(`${BASE}/api/insights/summary`, {
      headers: authFrom(req),
    })
    console.log("Summary data:", data)

    return NextResponse.json(data)
  } catch (e: any) {
    const { status, body } = errorJson(e)
    return new NextResponse(body, { status })
  }
}
