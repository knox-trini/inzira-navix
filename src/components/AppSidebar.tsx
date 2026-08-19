"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import {
  LayoutDashboard,
  Navigation,
  Route as RouteIcon,
  MapPin,
  BusFront,
  BarChart3,
  BrainCircuit,
  Bell,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const sidebarItems = [
  { href: "/auth", icon: LayoutDashboard, labelKey: "sidebar.dashboard" },
  { href: "/planner", icon: Navigation, labelKey: "sidebar.planner" },
  { href: "/routes", icon: RouteIcon, labelKey: "sidebar.routes" },
  { href: "/stations", icon: MapPin, labelKey: "sidebar.stations" },
  { href: "/fleet", icon: BusFront, labelKey: "sidebar.fleet" },
  { href: "/analytics", icon: BarChart3, labelKey: "sidebar.analytics" },
  { href: "/predictions", icon: BrainCircuit, labelKey: "sidebar.predictions" },
  { href: "/notifications", icon: Bell, labelKey: "sidebar.notifications" },
] as const;

export function AppSidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const sidebarContent = (
    <>
      <div className={`flex items-center gap-2.5 border-b border-sidebar-border px-4 py-4 ${collapsed ? "justify-center" : ""}`}>
        {!collapsed && <Logo />}
        {collapsed && (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
            IN
          </span>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="ml-auto hidden h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground lg:grid"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2.5 py-3">
        {sidebarItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-sidebar-accent text-sidebar-primary font-semibold"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              } ${collapsed ? "justify-center px-2" : ""}`}
              title={collapsed ? t(item.labelKey) : undefined}
            >
              <item.icon className={`h-5 w-5 shrink-0 ${active ? "text-sidebar-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"}`} />
              {!collapsed && <span>{t(item.labelKey)}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-sidebar-border px-2.5 py-3 space-y-1">
        <Link
          href="/#ai-assistant"
          className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all duration-150 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground ${collapsed ? "justify-center px-2" : ""}`}
          title={collapsed ? t("sidebar.aiAssistant") : undefined}
        >
          <Sparkles className="h-5 w-5 shrink-0 text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80" />
          {!collapsed && <span>{t("sidebar.aiAssistant")}</span>}
        </Link>
        <Link
          href="/auth"
          className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all duration-150 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground ${collapsed ? "justify-center px-2" : ""}`}
          title={collapsed ? t("sidebar.settings") : undefined}
        >
          <Settings className="h-5 w-5 shrink-0 text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80" />
          {!collapsed && <span>{t("sidebar.settings")}</span>}
        </Link>
        <button
          onClick={() => signOut()}
          className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive/80 transition-all duration-150 hover:bg-destructive/10 hover:text-destructive ${collapsed ? "justify-center px-2" : ""}`}
          title={collapsed ? t("nav.signOut") : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>{t("nav.signOut")}</span>}
        </button>
      </div>

      {!collapsed && user && (
        <div className="border-t border-sidebar-border px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">{user.name}</p>
              <p className="truncate text-[11px] text-sidebar-foreground/50">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-3.5 z-50 grid h-9 w-9 place-items-center rounded-xl border border-border bg-card text-foreground shadow-sm lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-3.5 grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-r lg:border-sidebar-border lg:bg-sidebar transition-all duration-200 ${
          collapsed ? "w-[68px]" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
