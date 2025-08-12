"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuthStore, type User } from "@/lib/auth-store"
import { toast } from "sonner"

export function useAuth(opts?: { autoHydrate?: boolean }) {
  const { user, token, setUser, setToken, clear } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState(false)

  // Hydrate user & token from localStorage on mount
  useEffect(() => {
    if (opts?.autoHydrate === false) return
    const savedToken = localStorage.getItem("auth_token")
    if (savedToken) {
      setToken(savedToken)
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user) setUser(data.user as User)
          setIsTokenValid(true)
        })
        .catch(() => {})
        .finally(() => setHydrated(true))
    } else {
      setHydrated(true)
      setIsTokenValid(false)
    }
  }, [opts?.autoHydrate, setToken, setUser])

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!res.ok || !data.token)
          throw new Error(data?.message || "Login failed")

        localStorage.setItem("auth_token", data.token)
        setToken(data.token)

        const me = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${data.token}` },
        }).then((r) => (r.ok ? r.json() : null))

        if (me?.user) setUser(me.user as User)
        toast.success("Welcome back ✨")
        return true
      } catch (e: any) {
        toast.error(e.message || "Login failed")
        return false
      } finally {
        setLoading(false)
      }
    },
    [setUser, setToken]
  )

  const logout = useCallback(() => {
    clear()
    toast.success("Logged out")
  }, [clear])

  return {
    user,
    token,
    loading,
    hydrated,
    login,
    logout,
    setUser,
    isTokenValid,
  }
}
