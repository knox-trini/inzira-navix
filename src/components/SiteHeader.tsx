"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X, LogOut, User as UserIcon, BarChart3, BrainCircuit, Ticket, BusFront, Bell } from "lucide-react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const nav = [
    { href: "/routes", label: t("nav.routes") },
    { href: "/stations", label: t("nav.stations") },
    { href: "/planner", label: t("nav.planner") },
    { href: "/tracking", label: t("nav.live") },
    { href: "/updates", label: t("nav.updates") },
  ] as const;

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground ${
                isActive(item.href) ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {isActive(item.href) && (
                <span className="absolute inset-x-2 -bottom-px h-px bg-primary" aria-hidden />
              )}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          {user && (
            <Link
              href="/notifications"
              aria-label={t("nav.notifications")}
              className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
            </Link>
          )}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card pl-1 pr-3 py-1 text-sm font-medium hover:bg-muted"
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-xs font-bold text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[120px] truncate">{user.name}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-popover/95 p-1.5 text-popover-foreground shadow-[var(--shadow-panel)] backdrop-blur-xl">
                  <div className="px-3 py-2 text-xs text-muted-foreground">{user.email}</div>
                  <Link
                    href="/auth"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                  >
                    <UserIcon className="h-4 w-4" /> {t("nav.account")}
                  </Link>
                  <Link
                    href="/analytics"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                  >
                    <BarChart3 className="h-4 w-4" /> {t("nav.analytics")}
                  </Link>
                  <Link
                    href="/predictions"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                  >
                    <BrainCircuit className="h-4 w-4" /> {t("nav.predictions")}
                  </Link>
                  <Link
                    href="/tickets"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                  >
                    <Ticket className="h-4 w-4" /> {t("nav.tickets")}
                  </Link>
                  <Link
                    href="/fleet"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                  >
                    <BusFront className="h-4 w-4" /> {t("nav.fleet")}
                  </Link>
                  <Link
                    href="/notifications"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                  >
                    <Bell className="h-4 w-4" /> {t("nav.notifications")}
                  </Link>
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" /> {t("nav.signOut")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth"
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted"
            >
              {t("nav.signIn")}
            </Link>
          )}
          <Link
            href="/planner"
            className="press sheen inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
          >
            {t("nav.planTrip")}
          </Link>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/auth"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-lg border border-border bg-card px-3 py-2.5 text-center text-sm font-semibold"
                >
                  {user.name}
                </Link>
                <Link
                  href="/analytics"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-muted"
                >
                  {t("nav.analytics")}
                </Link>
                <Link
                  href="/predictions"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-muted"
                >
                  {t("nav.predictions")}
                </Link>
                <Link
                  href="/tickets"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-muted"
                >
                  {t("nav.tickets")}
                </Link>
                <Link
                  href="/fleet"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-muted"
                >
                  {t("nav.fleet")}
                </Link>
                <Link
                  href="/notifications"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-muted"
                >
                  {t("nav.notifications")}
                </Link>
                <button
                  onClick={() => { signOut(); setOpen(false); }}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-destructive hover:bg-muted"
                >
                  {t("nav.signOut")}
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-lg border border-border bg-card px-3 py-2.5 text-center text-sm font-semibold"
              >
                {t("nav.signIn")}
              </Link>
            )}
            <Link
              href="/planner"
              onClick={() => setOpen(false)}
              className="press rounded-xl bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
            >
              {t("nav.planTrip")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
