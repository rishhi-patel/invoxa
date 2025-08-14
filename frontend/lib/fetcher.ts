// frontend/lib/fetcher.ts
export class ApiError extends Error {
  status: number
  details?: any
  constructor(status: number, message: string, details?: any) {
    super(message)
    this.status = status
    this.details = details
  }
}

function toRecord(h?: HeadersInit): Record<string, string> {
  if (!h) return {}
  if (h instanceof Headers) return Object.fromEntries(h.entries())
  if (Array.isArray(h)) return Object.fromEntries(h)
  return h as Record<string, string>
}

function withTimeout(ms: number) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), ms)
  return { signal: controller.signal, clear: () => clearTimeout(id) }
}

/**
 * Server-side fetch wrapper for Next route handlers that forward to microservices.
 * - No caching
 * - Safe header merge
 * - 10s timeout
 * - Returns parsed JSON (or text) on success
 * - Throws ApiError on non-2xx
 */
export async function forward<T = any>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  }
  const mergedHeaders = { ...baseHeaders, ...toRecord(init?.headers) }

  const t = withTimeout(10_000)

  let res: Response
  try {
    console.log(`[fetcher] ${init?.method || "GET"} ${url}`)

    res = await fetch(url + "/", {
      cache: "no-store",
      ...init,
      headers: mergedHeaders,
      signal: t.signal,
    })
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw new ApiError(504, "Upstream request timed out")
    }
    throw new ApiError(502, err?.message || "Upstream request failed")
  } finally {
    t.clear()
  }

  // Try JSON, fall back to text
  const contentType = res.headers.get("content-type") || ""
  const body = contentType.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text().catch(() => "")

  if (!res.ok) {
    const message =
      (typeof body === "object" && (body as any)?.message) ||
      (typeof body === "string" && body) ||
      res.statusText
    throw new ApiError(res.status, message, body)
  }

  return body as T
}
