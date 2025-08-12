"use client"

import { create } from "zustand"

export type User = { id: string; email: string }

type AuthState = {
  user: User | null
  token: string | null
  setUser: (u: User | null) => void
  setToken: (t: string | null) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (u) => set({ user: u }),
  setToken: (t) => set({ token: t }),
  clear: () => {
    localStorage.removeItem("auth_token")
    set({ user: null, token: null })
  },
}))
