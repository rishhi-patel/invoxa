"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ApiError } from "@/lib/http"

export function useOnError(error: unknown) {
  const router = useRouter()
  useEffect(() => {
    if (!error) return
    const e = error as ApiError
    const status = (e as any)?.status ?? 0

    if (status === 401) {
      toast.error("Session expired. Please sign in.")
      router.push("/login")
      return
    }
    if (status === 403) {
      toast.error("You don’t have permission to do that.")
      return
    }
    // fallback
    toast.error(e?.message || "Something went wrong")
  }, [error, router])
}
