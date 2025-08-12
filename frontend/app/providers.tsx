"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"
import { Toaster } from "sonner"

export default function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000, // 1 min
            gcTime: 5 * 60_000, // 5 min
            refetchOnWindowFocus: false,
            retry: (failureCount, err: any) => {
              const status = err?.status ?? 0
              // only retry network/5xx up to 2 times
              if (status >= 500 || status === 0) return failureCount < 2
              return false
            },
          },
          mutations: {
            retry: 0,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster richColors />
    </QueryClientProvider>
  )
}
