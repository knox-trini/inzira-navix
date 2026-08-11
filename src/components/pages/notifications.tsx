"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  notificationFeed,
  defaultNotificationPreferences,
  getRoute,
  type AppNotification,
  type NotificationChannel,
  type NotificationPreference,
} from "@/data/kigali";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { BellRing, CheckCheck, Clock3, Info, ShieldAlert, Wrench, type LucideIcon } from "lucide-react";

const PREFS_KEY = "inzira.notifications.prefs";
const READ_KEY = "inzira.notifications.read";

const CHANNELS: NotificationChannel[] = ["delay", "incident", "service", "eta"];

const TYPE_META: Record<AppNotification["type"], { icon: LucideIcon; tone: string }> = {
  delay: { icon: Clock3, tone: "bg-warning/20 text-warning-foreground" },
  incident: { icon: ShieldAlert, tone: "bg-destructive/15 text-destructive-foreground" },
  service: { icon: Wrench, tone: "bg-primary-soft text-primary" },
  info: { icon: Info, tone: "bg-muted text-muted-foreground" },
  eta: { icon: BellRing, tone: "bg-success/15 text-success-foreground" },
};

function readPrefs(): NotificationPreference[] {
  if (typeof window === "undefined") return defaultNotificationPreferences.map((p) => ({ ...p }));
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return defaultNotificationPreferences.map((p) => ({ ...p }));
    const parsed = JSON.parse(raw) as NotificationPreference[];
    return defaultNotificationPreferences.map(
      (d) => parsed.find((p) => p.channel === d.channel) ?? { ...d },
    );
  } catch {
    return defaultNotificationPreferences.map((p) => ({ ...p }));
  }
}

function readReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(READ_KEY) || "[]") as string[]);
  } catch {
    return new Set();
  }
}

export function NotificationsPage() {
  const { t } = useTranslation();
  const ready = useRequireAuth();
  const [prefs, setPrefs] = useState<NotificationPreference[]>(readPrefs);
  const [readIds, setReadIds] = useState<Set<string>>(readReadIds);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tk = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(tk);
  }, []);

  const feed = useMemo(
    () =>
      notificationFeed
        .filter((n) => prefs.find((p) => p.channel === n.type)?.enabled !== false)
        .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()),
    [prefs],
  );

  const unread = useMemo(() => feed.filter((n) => !readIds.has(n.id)).length, [feed, readIds]);

  function toggleChannel(channel: NotificationChannel) {
    const next = prefs.map((p) => (p.channel === channel ? { ...p, enabled: !p.enabled } : p));
    localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    setPrefs(next);
  }

  function markRead(id: string) {
    if (readIds.has(id)) return;
    const next = new Set(readIds);
    next.add(id);
    localStorage.setItem(READ_KEY, JSON.stringify([...next]));
    setReadIds(next);
  }

  function markAllRead() {
    const next = new Set(feed.map((n) => n.id));
    localStorage.setItem(READ_KEY, JSON.stringify([...next]));
    setReadIds(next);
  }

  function timeAgo(iso: string) {
    const m = Math.max(1, Math.floor((now.getTime() - new Date(iso).getTime()) / 60_000));
    if (m < 60) return t("updates.minAgo", { n: m });
    return t("updates.hrAgo", { n: Math.round(m / 60) });
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          {t("common.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
          <span className="h-px w-8 bg-primary" />
          {t("notifications.eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{t("notifications.title")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("notifications.body")}</p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-bold">{t("notifications.feedTitle")}</h2>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold hover:bg-muted"
              >
                <CheckCheck className="h-3.5 w-3.5" /> {t("notifications.markAllRead")}
              </button>
            )}
          </div>

          {feed.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              {t("notifications.noNotifications")}
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {feed.map((n) => {
                const meta = TYPE_META[n.type];
                const Icon = meta.icon;
                const route = n.routeId ? getRoute(n.routeId) : undefined;
                const isUnread = !readIds.has(n.id);
                return (
                  <li key={n.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => markRead(n.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          markRead(n.id);
                        }
                      }}
                      className={`hairline-top flex w-full cursor-pointer items-start gap-4 rounded-2xl border bg-card p-5 text-left shadow-[var(--shadow-soft)] transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--shadow-panel)] ${
                        isUnread ? "border-primary/30" : "border-border/80"
                      }`}
                    >
                      <span className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl ${meta.tone}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                          <span className="text-sm font-bold">{n.title}</span>
                          <span className="rounded-lg bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {t(`notifications.types.${n.type}`)}
                          </span>
                        </span>
                        <span className="mt-1 block text-sm text-muted-foreground">{n.body}</span>
                        <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                          <span>{timeAgo(n.postedAt)}</span>
                          {route && (
                            <Link
                              href={`/routes/${route.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-mono text-[10px] font-bold text-white transition-transform hover:scale-105"
                              style={{ background: route.color }}
                            >
                              {route.number}
                            </Link>
                          )}
                        </span>
                      </span>
                      {isUnread && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <aside>
          <div className="hairline-top rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">{t("notifications.prefsTitle")}</h3>
              {unread > 0 ? (
                <span className="rounded-lg bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
                  {unread} {t("notifications.unread")}
                </span>
              ) : (
                <span className="rounded-lg bg-success/15 px-2.5 py-1 text-[11px] font-bold text-success-foreground">
                  {t("notifications.allRead")}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t("notifications.prefsBody")}</p>
            <ul className="mt-5 space-y-2.5">
              {CHANNELS.map((c) => {
                const pref = prefs.find((p) => p.channel === c);
                const enabled = pref?.enabled ?? true;
                return (
                  <li key={c}>
                    <button
                      onClick={() => toggleChannel(c)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition ${
                        enabled ? "border-primary/30 bg-primary-soft/30" : "border-border bg-muted/40"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-semibold">{t(`notifications.types.${c}`)}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {t(`notifications.channelDescs.${c}`)}
                        </span>
                      </span>
                      <span
                        className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          enabled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {enabled ? t("notifications.on") : t("notifications.off")}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
