import { NextResponse } from "next/server"

export async function POST() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
  return NextResponse.json({ ok: true })
}
