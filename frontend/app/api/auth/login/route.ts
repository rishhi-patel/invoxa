import { NextResponse } from "next/server"
import { setAuthCookie } from "../../_utils/auth"

const AUTH_URL = process.env.AUTH_SERVICE_URL!

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const res = await fetch(`${AUTH_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || res.statusText },
        { status: res.status }
      )
    }

    if (!data?.token) {
      return NextResponse.json(
        { message: "No token in response" },
        { status: 500 }
      )
    }
    console.log(data)

    setAuthCookie(data.token)
    return NextResponse.json({ token: data.token ?? null })
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || "Login failed" },
      { status: 500 }
    )
  }
}
