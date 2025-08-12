"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Filter,
  FileText,
  Calendar,
  DollarSign,
  Pencil,
  Trash2,
} from "lucide-react"
import {
  useInvoices,
  useCreateInvoice,
  useUpdateInvoice,
  useDeleteInvoice,
} from "@/hooks/useInvoices"
import { useClients } from "@/hooks/useClients"

interface Invoice {
  _id: string
  clientSnapshot: {
    id: string
    name: string
    company: string
  }
  total: number
  status: string
  issuedAt: string | Date
  updatedAt: string | Date
}

const CLIENTS = [
  { id: "john", name: "John Doe", company: "Acme Corp" },
  { id: "sarah", name: "Sarah Wilson", company: "TechStart Inc" },
  { id: "mike", name: "Mike Johnson", company: "Design Co" },
  { id: "emily", name: "Emily Chen", company: "Startup.io" },
]

export function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null)
  const [form, setForm] = useState({
    clientId: "",
    amount: "",
    dueDate: "",
    description: "",
    status: "pending",
  })

  const {
    data: clients = [],
    isPending: isPendingClient,
    refetch: refetchClient,
  } = useClients()
  const { data: invoices = [], isPending, refetch } = useInvoices()
  const createInvoice = useCreateInvoice()
  const [updateInvoiceId, setUpdateInvoiceId] = useState<string | null>(null)
  const updateInvoice = useUpdateInvoice(updateInvoiceId ?? "")
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<string | null>(null)
  const deleteInvoice = useDeleteInvoice(deleteInvoiceId ?? "")

  const filteredInvoices = invoices.filter(
    (invoice: Invoice) =>
      statusFilter === "all" || invoice.status.toLowerCase() === statusFilter
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

  // Handlers for create
  const handleCreateChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreate = async () => {
    const client: { _id: string; name: string; company: string } | undefined =
      clients.find(
        (c: { _id: string; name: string; company: string }) =>
          c._id === form.clientId
      )
    if (!client) return
    await createInvoice.mutateAsync({
      clientSnapshot: client,
      total: Number(form.amount),
      status: form.status,
      issuedAt: new Date(),
      updatedAt: form.dueDate ? new Date(form.dueDate) : new Date(),
      description: form.description,
    })
    setIsCreateModalOpen(false)
    setForm({
      clientId: "",
      amount: "",
      dueDate: "",
      description: "",
      status: "pending",
    })
    refetch()
  }

  const openEditModal = (invoice: Invoice) => {
    setEditInvoice(invoice)
    setUpdateInvoiceId(invoice._id)
    setForm({
      clientId: invoice.clientSnapshot.id,
      amount: invoice.total.toString(),
      dueDate:
        typeof invoice.updatedAt === "string"
          ? invoice.updatedAt.slice(0, 10)
          : "",
      description: (invoice as any).description || "",
      status: invoice.status,
    })
    setIsEditModalOpen(true)
  }
  const handleEdit = async () => {
    if (!editInvoice) return
    const client: { _id: string; name: string; company: string } | undefined =
      clients.find(
        (c: { _id: string; name: string; company: string }) =>
          c._id === form.clientId
      )
    if (!client) return
    await updateInvoice.mutateAsync({
      _id: editInvoice._id,
      clientSnapshot: client,
      total: Number(form.amount),
      status: form.status,
      issuedAt: editInvoice.issuedAt,
      updatedAt: form.dueDate ? new Date(form.dueDate) : new Date(),
      description: form.description,
    })
    setIsEditModalOpen(false)
    setEditInvoice(null)
    setUpdateInvoiceId(null)
    setForm({
      clientId: "",
      amount: "",
      dueDate: "",
      description: "",
      status: "pending",
    })
    refetch()
  }

  // Handler for delete
  const handleDelete = async (id: string) => {
    setDeleteInvoiceId(id)
    await deleteInvoice.mutateAsync()
    setDeleteInvoiceId(null)
    refetch()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Invoices
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create, manage, and track your invoices and payments.
          </p>
        </div>

        {/* Create Invoice Dialog */}
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
              <DialogDescription>
                Fill in the details to create a new invoice for your client.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="invoice-client">Client</Label>
                <Select
                  value={form.clientId}
                  onValueChange={(v) => handleCreateChange("clientId", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLIENTS.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} - {c.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="invoice-amount">Amount</Label>
                  <Input
                    id="invoice-amount"
                    type="number"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) =>
                      handleCreateChange("amount", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="invoice-due">Due Date</Label>
                  <Input
                    id="invoice-due"
                    type="date"
                    value={form.dueDate}
                    onChange={(e) =>
                      handleCreateChange("dueDate", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invoice-description">Description</Label>
                <Textarea
                  id="invoice-description"
                  placeholder="Describe the services or products..."
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    handleCreateChange("description", e.target.value)
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invoice-status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => handleCreateChange("status", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createInvoice.isPending}>
                Create Invoice
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Invoice Dialog */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Invoice</DialogTitle>
              <DialogDescription>Update the invoice details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-invoice-client">Client</Label>
                <Select
                  value={form.clientId}
                  onValueChange={(v) => handleCreateChange("clientId", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(
                      (c: { _id: string; name: string; company: string }) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name} - {c.company}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-invoice-amount">Amount</Label>
                  <Input
                    id="edit-invoice-amount"
                    type="number"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) =>
                      handleCreateChange("amount", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-invoice-due">Due Date</Label>
                  <Input
                    id="edit-invoice-due"
                    type="date"
                    value={form.dueDate}
                    onChange={(e) =>
                      handleCreateChange("dueDate", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-invoice-description">Description</Label>
                <Textarea
                  id="edit-invoice-description"
                  placeholder="Describe the services or products..."
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    handleCreateChange("description", e.target.value)
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-invoice-status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => handleCreateChange("status", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEdit} disabled={updateInvoice.isPending}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Invoice Management</CardTitle>
              <CardDescription>
                Track and manage all your invoices in one place.
              </CardDescription>
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
                {filteredInvoices.map((invoice: Invoice) => (
                  <TableRow key={invoice._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        {invoice._id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {invoice.clientSnapshot.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invoice.clientSnapshot.company}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />$
                        {invoice.total.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(invoice.issuedAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(invoice.updatedAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(invoice)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(invoice._id)}
                        disabled={deleteInvoice.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
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
