// app/api/_utils/auth.ts (server-side)
export function authFrom(req: Request): Record<string, string> {
  const h = req.headers.get("authorization")
  return h ? { Authorization: h } : {}
}

export function json(body: unknown) {
  return { body: JSON.stringify(body) }
}

export function errorJson(e: any) {
  const status = e?.status || 500
  const message = e?.message || "Internal Server Error"
  return { status, body: JSON.stringify({ message }) }
}
