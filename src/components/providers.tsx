"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import i18n, { getInitial } from "@/i18n";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

const PUBLIC_PATHS = new Set(["/", "/auth"]);

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

function AuthGate() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (user || PUBLIC_PATHS.has(pathname)) return;

    const redirect = pathname && pathname !== "/" ? pathname : "/";
    router.replace(`/auth?redirect=${encodeURIComponent(redirect)}`);
  }, [pathname, router, user]);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ClientInit />
        <AuthGate />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}
