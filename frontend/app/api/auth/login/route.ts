import { NextResponse } from "next/server"

const AUTH_URL = process.env.BASE_API_URL!

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

    return NextResponse.json({ token: data.token ?? null })
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || "Login failed" },
      { status: 500 }
    )
  }
}
