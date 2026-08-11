"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { routes, getStation } from "@/data/kigali";
import { Search, Clock, MapPin, ArrowRight } from "lucide-react";
import { ControlCenter } from "@/components/ControlCenter";

export function RoutesListPage() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return routes;
    return routes.filter((r) =>
      [r.number, r.name, r.from, r.to, r.operator].some((x) => x.toLowerCase().includes(s)),
    );
  }, [q]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
          <span className="h-px w-8 bg-primary" />
          {t("routesPage.eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{t("routesPage.title")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("routesPage.body")}</p>
      </header>

      <div className="mt-10">
        <ControlCenter />
      </div>

      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-2 shadow-[var(--shadow-soft)] transition-shadow focus-within:ring-2 focus-within:ring-ring/40">
        <div className="grid h-10 w-10 place-items-center text-muted-foreground">
          <Search className="h-5 w-5" />
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("routesPage.placeholder")}
          className="h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {q && (
          <button onClick={() => setQ("")} className="rounded-lg px-3 text-xs font-medium text-muted-foreground hover:bg-muted">
            {t("common.clear")}
          </button>
        )}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {filtered.map((r) => (
          <Link
            key={r.id}
            href={`/routes/${r.id}`}
            className="hairline-top group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-panel)]"
          >
            <div className="absolute left-0 top-0 h-full w-1.5" style={{ background: r.color }} />
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-16 place-items-center rounded-xl font-mono text-base font-bold text-white" style={{ background: r.color }}>
                    {r.number}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{r.operator}</div>
                    <div className="font-semibold">{r.from} ↔ {r.to}</div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{r.name}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {t("routesPage.every", { n: r.frequencyMin })}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {t("routesPage.stops", { count: r.stopIds.length })}</span>
              <span>{r.firstBus} – {r.lastBus}</span>
              <span className="ml-auto font-semibold text-foreground">{r.fareRwf} RWF</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {r.stopIds.slice(0, 4).map((id) => (
                <span key={id} className="rounded-lg bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  {getStation(id)?.name}
                </span>
              ))}
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="md:col-span-2 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            {t("routesPage.noResults", { q })}
          </div>
        )}
      </div>
    </div>
  );
}
