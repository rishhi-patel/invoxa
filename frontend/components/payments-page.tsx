"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Calendar, DollarSign, FileText } from "lucide-react"

const payments = [
  {
    id: "PAY-001",
    client: "John Doe",
    company: "Acme Corp",
    invoiceId: "INV-001",
    amount: 2500,
    date: "2024-01-15",
    method: "Bank Transfer",
    status: "Completed",
  },
  {
    id: "PAY-002",
    client: "Sarah Wilson",
    company: "TechStart Inc",
    invoiceId: "INV-005",
    amount: 1200,
    date: "2024-01-12",
    method: "Credit Card",
    status: "Completed",
  },
  {
    id: "PAY-003",
    client: "Emily Chen",
    company: "Startup.io",
    invoiceId: "INV-007",
    amount: 3200,
    date: "2024-01-10",
    method: "PayPal",
    status: "Completed",
  },
  {
    id: "PAY-004",
    client: "Mike Johnson",
    company: "Design Co",
    invoiceId: "INV-003",
    amount: 950,
    date: "2024-01-08",
    method: "Bank Transfer",
    status: "Processing",
  },
  {
    id: "PAY-005",
    client: "John Doe",
    company: "Acme Corp",
    invoiceId: "INV-009",
    amount: 1800,
    date: "2024-01-05",
    method: "Credit Card",
    status: "Completed",
  },
]

export function PaymentsPage() {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "credit card":
        return <CreditCard className="w-4 h-4 text-gray-400" />
      case "bank transfer":
        return <DollarSign className="w-4 h-4 text-gray-400" />
      case "paypal":
        return <DollarSign className="w-4 h-4 text-gray-400" />
      default:
        return <DollarSign className="w-4 h-4 text-gray-400" />
    }
  }

  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const completedPayments = payments.filter((p) => p.status === "Completed").length
  const processingPayments = payments.filter((p) => p.status === "Processing").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track and monitor all incoming payments from your clients.
        </p>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">${totalPayments.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">{payments.length} total transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedPayments}</div>
            <p className="text-xs text-gray-500 mt-1">Successfully processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Processing</CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{processingPayments}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>A complete record of all payments received.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        {payment.id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.client}</div>
                        <div className="text-sm text-gray-500">{payment.company}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        {payment.invoiceId}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />${payment.amount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMethodIcon(payment.method)}
                        {payment.method}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(payment.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
