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
  return q
}

export function useCreateClient() {
  const qc = useQueryClient()
  return useMutation({
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
}

export function useUpdateClient(id: string) {
  const qc = useQueryClient()
  return useMutation({
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
}

export function useDeleteClient(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api(`/api/clients/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Client deleted")
      qc.invalidateQueries({ queryKey: ["clients"] })
    },
    onError: (e: any) => {
      toast.error(e?.message ?? "Failed to delete client")
    },
  })
}
