"use client"

import { useState } from "react"
import { LoginPage } from "@/components/login-page"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />
  }

  return <DashboardLayout />
}
