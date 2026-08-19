"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import {
  Search,
  Bell,
  BrainCircuit,
  LogOut,
  User as UserIcon,
  Settings,
} from "lucide-react";

function getPageTitle(pathname: string): string {
  if (pathname === "/auth") return "Dashboard";
  if (pathname.startsWith("/planner")) return "Trip Planner";
  if (pathname.startsWith("/routes")) return "Routes";
  if (pathname.startsWith("/stations")) return "Stations";
  if (pathname.startsWith("/fleet")) return "Fleet";
  if (pathname.startsWith("/analytics")) return "Analytics";
  if (pathname.startsWith("/predictions")) return "Predictions";
  if (pathname.startsWith("/notifications")) return "Notifications";
  if (pathname.startsWith("/tickets")) return "Tickets";
  if (pathname.startsWith("/tracking")) return "Live Tracking";
  if (pathname.startsWith("/updates")) return "Updates";
  return "Dashboard";
}

export function AppTopNav() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pageTitle = getPageTitle(pathname);

  return (
    <div className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <span className="ml-10 lg:ml-0 text-lg font-bold tracking-tight text-foreground lg:text-xl">
        {pageTitle}
      </span>

      <div className="flex-1" />

      {/* Search */}
      <div className="hidden sm:block">
        {searchOpen ? (
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("common.search") + "..."}
              autoFocus
              onBlur={() => setSearchOpen(false)}
              className="w-48 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            />
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={t("common.search")}
          >
            <Search className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Notifications */}
      <Link
        href="/notifications"
        className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label={t("nav.notifications")}
      >
        <Bell className="h-4 w-4" />
      </Link>

      {/* AI Assistant */}
      <button
        className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label={t("sidebar.aiAssistant")}
        onClick={() => {
          document.dispatchEvent(new CustomEvent("open-ai-assistant"));
        }}
      >
        <BrainCircuit className="h-4 w-4" />
      </button>

      <LanguageSwitcher />
      <ThemeToggle />

      {/* User menu */}
      {user && (
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card pl-1 pr-3 py-1 text-sm font-medium hover:bg-muted"
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-xs font-bold text-primary-foreground">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <span className="hidden max-w-[120px] truncate sm:inline">{user.name}</span>
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-border bg-popover/95 p-1.5 text-popover-foreground shadow-[var(--shadow-panel)] backdrop-blur-xl">
                <div className="px-3 py-2 text-xs text-muted-foreground">{user.email}</div>
                <Link
                  href="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                >
                  <UserIcon className="h-4 w-4" /> {t("nav.account")}
                </Link>
                <Link
                  href="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                >
                  <Settings className="h-4 w-4" /> {t("sidebar.settings")}
                </Link>
                <button
                  onClick={() => { signOut(); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-muted"
                >
                  <LogOut className="h-4 w-4" /> {t("nav.signOut")}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
