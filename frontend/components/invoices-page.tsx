"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Filter, FileText, Calendar, DollarSign } from "lucide-react"

const invoices = [
  {
    id: "INV-001",
    client: "John Doe",
    company: "Acme Corp",
    amount: 2500,
    status: "Paid",
    dueDate: "2024-01-15",
    issueDate: "2024-01-01",
  },
  {
    id: "INV-002",
    client: "Sarah Wilson",
    company: "TechStart Inc",
    amount: 1800,
    status: "Pending",
    dueDate: "2024-01-20",
    issueDate: "2024-01-05",
  },
  {
    id: "INV-003",
    client: "Mike Johnson",
    company: "Design Co",
    amount: 950,
    status: "Overdue",
    dueDate: "2024-01-10",
    issueDate: "2023-12-25",
  },
  {
    id: "INV-004",
    client: "Emily Chen",
    company: "Startup.io",
    amount: 3200,
    status: "Draft",
    dueDate: "2024-02-01",
    issueDate: "2024-01-15",
  },
]

export function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const filteredInvoices = invoices.filter(
    (invoice) => statusFilter === "all" || invoice.status.toLowerCase() === statusFilter,
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoices</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Create, manage, and track your invoices and payments.</p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
              <DialogDescription>Fill in the details to create a new invoice for your client.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="invoice-client">Client</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Doe - Acme Corp</SelectItem>
                    <SelectItem value="sarah">Sarah Wilson - TechStart Inc</SelectItem>
                    <SelectItem value="mike">Mike Johnson - Design Co</SelectItem>
                    <SelectItem value="emily">Emily Chen - Startup.io</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="invoice-amount">Amount</Label>
                  <Input id="invoice-amount" type="number" placeholder="0.00" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="invoice-due">Due Date</Label>
                  <Input id="invoice-due" type="date" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invoice-description">Description</Label>
                <Textarea id="invoice-description" placeholder="Describe the services or products..." rows={3} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateModalOpen(false)}>Create Invoice</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Invoice Management</CardTitle>
              <CardDescription>Track and manage all your invoices in one place.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        {invoice.id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.client}</div>
                        <div className="text-sm text-gray-500">{invoice.company}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />${invoice.amount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(invoice.issueDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
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
