"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  FileText,
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import {
  useRecentActivity,
  useRevenueTrends,
  useSummary,
} from "@/hooks/useInsights"
import { RevenueChart } from "@/components/revenue-chart"

const stats = [
  {
    title: "Total Clients",
    value: "24",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Total Invoices",
    value: "156",
    change: "+8%",
    changeType: "positive" as const,
    icon: FileText,
  },
  {
    title: "Revenue This Month",
    value: "$12,450",
    change: "+23%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Pending Payments",
    value: "$3,200",
    change: "-5%",
    changeType: "negative" as const,
    icon: Clock,
  },
]

const recentActivity = [
  {
    id: 1,
    action: "Invoice #INV-001 sent to John Doe",
    time: "2 minutes ago",
    type: "invoice",
  },
  {
    id: 2,
    action: "Payment received from Acme Corp - $2,500",
    time: "1 hour ago",
    type: "payment",
  },
  {
    id: 3,
    action: "New client added: Sarah Wilson",
    time: "3 hours ago",
    type: "client",
  },
  {
    id: 4,
    action: "Invoice #INV-002 marked as paid",
    time: "5 hours ago",
    type: "payment",
  },
  {
    id: 5,
    action: "Reminder sent for Invoice #INV-003",
    time: "1 day ago",
    type: "reminder",
  },
]

export function DashboardPage() {
  const { data: summary, isLoading: l1 } = useSummary()
  const { data: trends, isLoading: l2 } = useRevenueTrends(6)
  const { data: activity, isLoading: l3 } = useRecentActivity(10)

  console.log("Summary:", summary, trends, activity)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Here's what's happening with your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="flex items-center mt-2">
                  {stat.changeType === "positive" ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>
              Monthly revenue for the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
