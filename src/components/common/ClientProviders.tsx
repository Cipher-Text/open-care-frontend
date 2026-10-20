"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/auth-context";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            // Retry once, and never on 4xx (a 429 retried 3x only makes it worse)
            retry: (failureCount, error) =>
              failureCount < 1 &&
              !/\b4\d\d\b/.test(String((error as Error)?.message ?? "")),
          },
        },
      });

    // Reference data changes rarely and is shared by many screens: keep it for an hour so
    // moving between pages does not re-download it
    const REFERENCE_KEYS = [
      "districts",
      "upazilas",
      "divisions",
      "unions",
      "specialities",
      "specialities-all",
      "medical-specialities-all",
      "degrees",
      "institutions-all",
      "hospitals-all",
      "hospital-types",
      "organization-types",
    ];
    REFERENCE_KEYS.forEach((key) =>
      client.setQueryDefaults([key], { staleTime: 60 * 60 * 1000 })
    );
    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
