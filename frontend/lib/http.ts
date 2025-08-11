export class ApiError extends Error {
  status: number
  details?: any
  constructor(status: number, message: string, details?: any) {
    super(message)
    this.status = status
    this.details = details
  }
}

export async function api<T = any>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    cache: "no-store",
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  })
  let data: any = null
  try {
    data = await res.json()
  } catch {}
  if (!res.ok) {
    throw new ApiError(res.status, data?.message || res.statusText, data)
  }
  return data as T
}

// tiny helper so we can pass objects to body easily
export const json = (body: any): RequestInit => ({ body: JSON.stringify(body) })
