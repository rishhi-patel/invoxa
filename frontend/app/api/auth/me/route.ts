import { forward } from "@/lib/fetcher"
import { NextResponse } from "next/server"
import { authFrom } from "../../_utils/auth"

const AUTH_URL = process.env.AUTH_SERVICE_URL!

export async function GET(req: Request) {
  try {
    const res = await forward(`${AUTH_URL}/api/auth/validate`, {
      headers: authFrom(req),
    })
    console.log(res)

    const status = res.valid ? 200 : 401
    const ok = res.valid ?? (status >= 200 && status < 300)

    if (!ok) {
      return NextResponse.json(
        { user: null, message: "Unauthorized" },
        { status }
      )
    }
    return NextResponse.json({ user: res })
  } catch (e: any) {
    return NextResponse.json(
      { user: null, message: e?.message || "Validation failed" },
      { status: 500 }
    )
  }
}
