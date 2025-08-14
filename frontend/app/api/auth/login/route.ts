import { forward } from "@/lib/fetcher"
import { NextResponse } from "next/server"

const AUTH_URL = process.env.NEXT_PUBLIC_BASE_API_URL!

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const res = await forward(`${AUTH_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    })

    if (res?.token) {
      return NextResponse.json({ token: res.token ?? null })
    }
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || "Login failed" },
      { status: 500 }
    )
  }
}
