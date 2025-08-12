import { NextResponse } from "next/server"
import { clearAuthCookie } from "../../_utils/auth"

export async function POST() {
  clearAuthCookie()
  return NextResponse.json({ ok: true })
}
