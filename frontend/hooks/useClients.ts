import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api, json } from "@/lib/http"
import { useOnError } from "./useQueryErrors"
import { toast } from "sonner"

export function useClients() {
  const q = useQuery({
    queryKey: ["clients"],
    queryFn: () => api("/api/clients"),
  })
  useOnError(q.error)
  return { ...q, isLoadsing: q.isLoading }
}

export function useCreateClient() {
  const qc = useQueryClient()
  const mutation = useMutation({
    mutationFn: (body: any) =>
      api("/api/clients", { method: "POST", ...json(body) }),
    onSuccess: () => {
      toast.success("Client added")
      qc.invalidateQueries({ queryKey: ["clients"] })
    },
    onError: (e: any) => {
      toast.error(e?.message ?? "Failed to create client")
    },
  })
  return { ...mutation, isLoadsing: mutation.isPending }
}

export function useUpdateClient(id: string) {
  const qc = useQueryClient()
  const mutation = useMutation({
    mutationFn: (body: any) =>
      api(`/api/clients/${id}`, { method: "PUT", ...json(body) }),
    onSuccess: () => {
      toast.success("Client updated")
      qc.invalidateQueries({ queryKey: ["clients"] })
    },
    onError: (e: any) => {
      toast.error(e?.message ?? "Failed to update client")
    },
  })
  return { ...mutation, isLoadsing: mutation.isPending }
}

export function useDeleteClient(id: string) {
  const qc = useQueryClient()
  const mutation = useMutation({
    mutationFn: () => api(`/api/clients/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Client deleted")
      qc.invalidateQueries({ queryKey: ["clients"] })
    },
    onError: (e: any) => {
      toast.error(e?.message ?? "Failed to delete client")
    },
  })
  return { ...mutation, isLoadsing: mutation.isPending }
}
