"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import AuthGate from "@/components/auth-gate"

export default function Home() {
  return (
    <AuthGate>
      <DashboardLayout />
    </AuthGate>
  )
}
