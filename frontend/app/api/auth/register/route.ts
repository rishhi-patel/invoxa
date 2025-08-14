import { NextResponse } from "next/server"

const AUTH_URL = process.env.BASE_API_URL!

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const res = await fetch(`${AUTH_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json(
        { message: data?.token || res.statusText },
        { status: res.status }
      )
    }
    // many auth APIs auto‑login on register; if yours returns a token, set it here
    if (data?.token) {
      const { setAuthCookie } = await import("../../_utils/auth")
      setAuthCookie(data.token)
      return NextResponse.json({ user: data.user ?? null })
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || "Register failed" },
      { status: 500 }
    )
  }
}
