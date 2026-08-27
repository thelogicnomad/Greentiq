"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import { CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: "!bg-card !text-card-foreground !border-border shadow-2xl rounded-xl text-xs font-medium border",
          }}
          icons={{
            success: <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />,
            error: <XCircle className="h-4 w-4 text-rose-500 shrink-0" />,
            info: <Info className="h-4 w-4 text-sky-400 shrink-0" />,
            warning: <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />,
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
