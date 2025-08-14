import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/http"
import { useOnError } from "./useQueryErrors"

export function useSummary() {
  const q = useQuery({
    queryKey: ["insights", "summary"],
    queryFn: () => api("/api/insights/summary"),
  })
  useOnError(q.error)
  return q
}

export function useRevenueTrends(months = 6) {
  const q = useQuery({
    queryKey: ["insights", "trends", months],
    queryFn: () => api(`/api/insights/revenue-trends?months=${months}`),
  })
  useOnError(q.error)
  return q
}

export function useRecentActivity(limit = 10) {
  const q = useQuery({
    queryKey: ["insights", "activity", limit],
    queryFn: () => api(`/api/insights/recent-activity?limit=${limit}`),
  })
  useOnError(q.error)
  return q
}
