import { NextResponse } from "next/server"
import { authHeader } from "../../_utils/auth"

const AUTH_URL = process.env.AUTH_SERVICE_URL!

export async function GET() {
  const headers = await authHeader()
  console.log("Headers for auth validation:", headers)

  if (!headers.Authorization) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  try {
    const res = await fetch(`${AUTH_URL}/api/auth/validate`, {
      method: "GET",
      headers,
      cache: "no-store",
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json(
        { user: null, message: data?.message || "Unauthorized" },
        { status: res.status }
      )
    }
    // shape depends on your auth-service; adjust as needed
    return NextResponse.json({ user: data?.user ?? { id: data?.id } })
  } catch (e: any) {
    return NextResponse.json(
      { user: null, message: e.message || "Validation failed" },
      { status: 500 }
    )
  }
}
