"use client"

export async function api<T = any>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null

  const res = await fetch(url, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  })

  let data: any = null
  try {
    data = await res.json()
  } catch {}

  if (!res.ok) {
    throw new Error(data?.message || res.statusText)
  }

  return data as T
}

export function json(body: unknown) {
  return { body: JSON.stringify(body) }
}
