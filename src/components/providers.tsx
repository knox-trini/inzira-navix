"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";

import i18n, { getInitial } from "@/i18n";
import { AuthProvider } from "@/hooks/useAuth";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

function ClientInit() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const lang = getInitial();
    if (lang !== i18n.language) {
      void i18n.changeLanguage(lang);
    }
  }, []);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ClientInit />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}
