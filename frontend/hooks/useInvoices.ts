import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api, json } from "@/lib/http"
import { useOnError } from "./useQueryErrors"
import { toast } from "sonner"

export function useInvoices() {
  const q = useQuery({
    queryKey: ["invoices"],
    queryFn: () => api("/api/invoices"),
  })
  useOnError(q.error)
  return q
}

export function useCreateInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: any) =>
      api("/api/invoices", { method: "POST", ...json(body) }),
    onSuccess: () => {
      toast.success("Invoice created")
      qc.invalidateQueries({ queryKey: ["invoices"] })
    },
    onError: (e: any) => {
      toast.error(e?.message ?? "Failed to create invoice")
    },
  })
}

export function useUpdateInvoice(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: any) =>
      api(`/api/invoice/${id}`, { method: "PUT", ...json(body) }),
    onSuccess: () => {
      toast.success("Invoice updated")
      qc.invalidateQueries({ queryKey: ["invoices"] })
    },
    onError: (e: any) => {
      toast.error(e?.message ?? "Failed to update invoice")
    },
  })
}

export function useDeleteInvoice(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api(`/api/invoice/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Invoice deleted")
      qc.invalidateQueries({ queryKey: ["invoices"] })
    },
    onError: (e: any) => {
      toast.error(e?.message ?? "Failed to delete invoice")
    },
  })
}
