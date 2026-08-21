"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import i18n, { getInitial } from "@/i18n";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { PublicHeader } from "./PublicHeader";
import { SiteFooter } from "./SiteFooter";
import { AppSidebar } from "./AppSidebar";
import { AppTopNav } from "./AppTopNav";
import { AiAssistant } from "./ai/AiAssistant";

const PUBLIC_PATHS = new Set(["/", "/auth", "/privacy", "/terms"]);

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
  const { user, status } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (status === "loading") return;
    if (user || PUBLIC_PATHS.has(pathname)) return;

    const redirect = pathname && pathname !== "/" ? pathname : "/";
    router.replace(`/auth?redirect=${encodeURIComponent(redirect)}`);
  }, [pathname, router, user, status]);

  return null;
}

function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopNav />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

function LayoutRouter({ children }: { children: ReactNode }) {
  const { user, status } = useAuth();
  const pathname = usePathname();

  const isAuthPage = pathname === "/auth";
  const isPublicPage = PUBLIC_PATHS.has(pathname);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isAuthPage) {
    return (
      <div className="flex min-h-screen flex-col">
        <PublicHeader />
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  if (!user || isPublicPage) {
    return <PublicLayout>{children}</PublicLayout>;
  }

  return <AppLayout>{children}</AppLayout>;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ClientInit />
          <AuthGate />
          <LayoutRouter>{children}</LayoutRouter>
          <AiAssistant />
        </AuthProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
