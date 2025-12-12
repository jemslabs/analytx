"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { trpc } from "../app/_trpc/trpc";
import { httpBatchLink } from "@trpc/client";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: "always",
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            staleTime: 0, // always fetch fresh
          },
        },
      }));
    const trpcClient = useMemo(
        () => trpc.createClient({
            links: [
                httpBatchLink({
                    url: '/api/trpc'
                })
            ]
        }),
        []
    )
 
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </trpc.Provider>
    )
}