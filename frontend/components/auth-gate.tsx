"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { hydrated, user, token, isTokenValid } = useAuth({ autoHydrate: true })
  const router = useRouter()

  useEffect(() => {
    if (!hydrated) return
    if (!token || !user || !isTokenValid) router.replace("/login")
  }, [hydrated, token, user, isTokenValid, router])

  if (!hydrated) {
    return <div className="p-6">Checking session…</div>
  }
  if (!token || !user || !isTokenValid) return null

  return <>{children}</>
}
