"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DashboardPage } from "@/components/dashboard-page"
import { ClientsPage } from "@/components/clients-page"
import { InvoicesPage } from "@/components/invoices-page"
import { PaymentsPage } from "@/components/payments-page"
import { NotificationsPage } from "@/components/notifications-page"

export function DashboardLayout() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />
      case "clients":
        return <ClientsPage />
      case "invoices":
        return <InvoicesPage />
      case "payments":
        return <PaymentsPage />
      case "notifications":
        return <NotificationsPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-6">{renderPage()}</main>
      </div>
    </div>
  )
}
