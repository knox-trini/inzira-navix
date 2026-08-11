"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { updates, getRoute } from "@/data/kigali";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { AlertTriangle, Info, Bus, Clock } from "lucide-react";

const typeMeta = {
  delay: { icon: Clock, color: "text-warning-foreground", bg: "bg-warning/30" },
  incident: { icon: AlertTriangle, color: "text-destructive-foreground", bg: "bg-destructive/15" },
  service: { icon: Bus, color: "text-primary", bg: "bg-primary-soft" },
  info: { icon: Info, color: "text-foreground", bg: "bg-muted" },
} as const;

export function UpdatesPage() {
  const { t } = useTranslation();
  const ready = useRequireAuth();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const tk = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(tk);
  }, []);

  function timeAgo(iso: string) {
    const diff = now - new Date(iso).getTime();
    const m = Math.round(diff / 60000);
    if (m < 60) return t("updates.minAgo", { n: m });
    return t("updates.hrAgo", { n: Math.round(m / 60) });
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          {t("common.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <header>
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
          <span className="h-px w-8 bg-primary" />
          {t("updates.eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{t("updates.title")}</h1>
        <p className="mt-3 text-muted-foreground">{t("updates.body")}</p>
      </header>

      <div className="mt-10 space-y-4">
        {updates.map((u) => {
          const m = typeMeta[u.type];
          const Icon = m.icon;
          const label = t(`updates.types.${u.type}`);
          return (
            <article key={u.id} className="hairline-top rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-soft)]">
              <div className="flex items-start gap-4">
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${m.bg}`}>
                  <Icon className={`h-5 w-5 ${m.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${m.bg} ${m.color}`}>{label}</span>
                      <span className="text-xs text-muted-foreground">{timeAgo(u.postedAt)}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {u.routeIds.map((rid) => {
                        const r = getRoute(rid);
                        if (!r) return null;
                        return (
                          <Link
                            key={rid}
                            href={`/routes/${rid}`}
                            className="rounded-md px-2 py-0.5 font-mono text-[11px] font-bold text-white"
                            style={{ background: r.color }}
                          >
                            {r.number}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                  <h2 className="mt-2 text-lg font-semibold">{u.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{u.body}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
