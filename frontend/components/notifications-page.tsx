"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Clock, CheckCircle, AlertCircle, FileText, Users } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "invoice_sent",
    title: "Invoice #INV-001 sent to John Doe",
    description: "Invoice for $2,500 has been successfully sent to john@example.com",
    timestamp: "2024-01-15T10:30:00Z",
    status: "delivered",
    recipient: "john@example.com",
  },
  {
    id: 2,
    type: "payment_received",
    title: "Payment received from Acme Corp",
    description: "Payment of $2,500 received for Invoice #INV-001",
    timestamp: "2024-01-15T14:45:00Z",
    status: "success",
    recipient: "john@example.com",
  },
  {
    id: 3,
    type: "invoice_reminder",
    title: "Payment reminder sent for Invoice #INV-003",
    description: "Reminder sent to mike@designco.com for overdue payment of $950",
    timestamp: "2024-01-14T09:15:00Z",
    status: "delivered",
    recipient: "mike@designco.com",
  },
  {
    id: 4,
    type: "invoice_sent",
    title: "Invoice #INV-002 sent to Sarah Wilson",
    description: "Invoice for $1,800 has been successfully sent to sarah@techstart.com",
    timestamp: "2024-01-12T16:20:00Z",
    status: "delivered",
    recipient: "sarah@techstart.com",
  },
  {
    id: 5,
    type: "client_added",
    title: "New client added: Emily Chen",
    description: "Emily Chen from Startup.io has been added to your client database",
    timestamp: "2024-01-10T11:00:00Z",
    status: "success",
    recipient: "emily@startup.io",
  },
  {
    id: 6,
    type: "invoice_overdue",
    title: "Invoice #INV-003 is now overdue",
    description: "Payment for $950 from Design Co is now 5 days overdue",
    timestamp: "2024-01-09T08:00:00Z",
    status: "warning",
    recipient: "mike@designco.com",
  },
]

export function NotificationsPage() {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "invoice_sent":
        return <FileText className="w-5 h-5 text-blue-500" />
      case "payment_received":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "invoice_reminder":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "client_added":
        return <Users className="w-5 h-5 text-purple-500" />
      case "invoice_overdue":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Mail className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Delivered</Badge>
      case "success":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">Success</Badge>
      case "warning":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Warning</Badge>
        )
      case "failed":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Failed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} days ago`
    }
  }

  const deliveredCount = notifications.filter((n) => n.status === "delivered").length
  const successCount = notifications.filter((n) => n.status === "success").length
  const warningCount = notifications.filter((n) => n.status === "warning").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track all email notifications and system alerts sent to your clients.
        </p>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Delivered</CardTitle>
            <Mail className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{deliveredCount}</div>
            <p className="text-xs text-gray-500 mt-1">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Actions</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{successCount}</div>
            <p className="text-xs text-gray-500 mt-1">Completed actions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Warnings</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
            <p className="text-xs text-gray-500 mt-1">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>All email notifications and system alerts sent to clients.</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Mark All as Read
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-500">{formatTimestamp(notification.timestamp)}</span>
                        <span className="text-xs text-gray-500">To: {notification.recipient}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">{getStatusBadge(notification.status)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
