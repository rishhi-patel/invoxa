import { cookies } from "next/headers"
const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "invoxa_token"
const SECURE = process.env.AUTH_COOKIE_SECURE === "true"

/** Always return a plain record; never an optional/undefined value */
export async function authHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const t = cookieStore.get(COOKIE_NAME)?.value
  return t ? { Authorization: `Bearer ${t}` } : {}
}

/** Small helper for JSON bodies */
export function json(body: unknown) {
  return { body: JSON.stringify(body) }
}

export async function setAuthCookie(
  token: string,
  maxAgeSeconds = 60 * 60 * 24 * 7
) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: SECURE,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/** Normalize error to JSON response pieces */
export function errorJson(e: any) {
  const status = e?.status || 500
  const message = e?.message || "Internal Server Error"
  return { status, body: JSON.stringify({ message }) }
}
