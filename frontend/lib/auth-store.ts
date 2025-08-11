"use client"
import { create } from "zustand"

type AuthState = {
  user: { id: string; email: string } | null
  setUser: (u: AuthState["user"]) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
  clear: () => set({ user: null }),
}))
