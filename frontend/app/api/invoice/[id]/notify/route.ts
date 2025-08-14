import { NextResponse } from "next/server"
import { authFrom, errorJson } from "../../../_utils/auth"
import { forward } from "@/lib/fetcher"

const BASE = process.env.NEXT_PUBLIC_BASE_API_URL!

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const data = await forward(`${BASE}/api/invoice/${params.id}/notify`, {
      method: "POST",
      headers: authFrom(_),
    })
    return NextResponse.json(data)
  } catch (e: any) {
    const { status, body } = errorJson(e)
    return new NextResponse(body, { status })
  }
}
