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
import { Plus, Search, Mail, Phone, Building, Edit, Trash } from "lucide-react"
import {
  useClients,
  useUpdateClient,
  useDeleteClient,
  useCreateClient,
} from "@/hooks/useClients"

interface Client {
  _id: string
  name: string
  email: string
  company: string
  phone: string
  status: "Active" | "Inactive" | string
  totalRevenue: number
}

export function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
  })
  const [editClient, setEditClient] = useState<Client | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
  })
  const [editClientId, setEditClientId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: clients = [], isPending, refetch } = useClients()
  const createClient = useCreateClient()
  const updateClient = useUpdateClient(editClientId || "")
  const deleteClient = useDeleteClient(deleteId || "")

  const filteredClients = (clients as Client[]).filter(
    (client: Client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Add Client Handler
  const handleAddClient = async () => {
    await createClient.mutateAsync(addForm)
    setIsAddModalOpen(false)
    setAddForm({ name: "", email: "", company: "", phone: "" })
    refetch()
  }
  // Edit Client Handler
  const handleEditClient = (client: Client) => {
    setEditClient(client)
    setEditClientId(client._id)
    setEditForm({
      name: client.name,
      email: client.email,
      company: client.company,
      phone: client.phone,
    })
  }

  const handleUpdateClient = async () => {
    if (editClient) {
      await updateClient.mutateAsync({ id: editClient._id, ...editForm })
      setEditClient(null)
      setEditClientId(null)
      refetch()
    }
  }

  const handleDeleteClient = async (id: string) => {
    setDeleteId(id)
    await deleteClient.mutateAsync()
    setDeleteId(null)
    refetch()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Clients
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your client relationships and contact information.
          </p>
        </div>

        {/* Add Client Dialog */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Enter the client's information to add them to your database.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="client-name">Full Name</Label>
                <Input
                  id="client-name"
                  placeholder="John Doe"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client-email">Email</Label>
                <Input
                  id="client-email"
                  type="email"
                  placeholder="john@example.com"
                  value={addForm.email}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client-company">Company</Label>
                <Input
                  id="client-company"
                  placeholder="Acme Corp"
                  value={addForm.company}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, company: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client-phone">Phone</Label>
                <Input
                  id="client-phone"
                  placeholder="+1 (555) 123-4567"
                  value={addForm.phone}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, phone: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddClient}
                disabled={createClient.isPending}
              >
                Add Client
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Client Dialog */}
        <Dialog
          open={!!editClient}
          onOpenChange={(open) => !open && setEditClient(null)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription>
                Update the client's information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-client-name">Full Name</Label>
                <Input
                  id="edit-client-name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-client-email">Email</Label>
                <Input
                  id="edit-client-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-client-company">Company</Label>
                <Input
                  id="edit-client-company"
                  value={editForm.company}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, company: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-client-phone">Phone</Label>
                <Input
                  id="edit-client-phone"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, phone: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditClient(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateClient}
                disabled={updateClient.isPending}
              >
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
              <CardTitle>Client Directory</CardTitle>
              <CardDescription>
                A list of all your clients and their information.
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client._id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {client.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        {client.company}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {client.phone}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditClient(client)}
                        className="mr-2"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDeleteClient(client._id)}
                        disabled={deleteClient.isPending}
                      >
                        <Trash className="w-4 h-4" />
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
