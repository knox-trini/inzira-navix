"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { fleet, getRoute, type BusStatus } from "@/data/kigali";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Bus, CheckCircle2, PauseCircle, Wrench, type LucideIcon } from "lucide-react";

const STATUS_TONE: Record<BusStatus, string> = {
  active: "bg-success/15 text-success-foreground",
  idle: "bg-muted text-muted-foreground",
  maintenance: "bg-destructive/15 text-destructive-foreground",
};

export function FleetPage() {
  const { t } = useTranslation();
  const ready = useRequireAuth();
  const [status, setStatus] = useState<BusStatus | null>(null);
  const [routeId, setRouteId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      total: fleet.length,
      active: fleet.filter((b) => b.status === "active").length,
      idle: fleet.filter((b) => b.status === "idle").length,
      maintenance: fleet.filter((b) => b.status === "maintenance").length,
    }),
    [],
  );

  const routeOptions = useMemo(
    () => Array.from(new Set(fleet.map((b) => b.routeId))).map((id) => getRoute(id)!).filter(Boolean),
    [],
  );

  const filtered = useMemo(
    () =>
      fleet.filter(
        (b) =>
          (status ? b.status === status : true) &&
          (routeId ? b.routeId === routeId : true),
      ),
    [status, routeId],
  );

  if (!ready) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          {t("common.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
          <span className="h-px w-8 bg-primary" />
          {t("fleetPage.eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{t("fleetPage.title")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("fleetPage.body")}</p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Bus} label={t("fleetPage.totalBuses")} value={counts.total} />
        <Stat icon={CheckCircle2} label={t("fleetPage.activeBuses")} value={counts.active} tone="text-success" />
        <Stat icon={PauseCircle} label={t("fleetPage.idleBuses")} value={counts.idle} tone="text-muted-foreground" />
        <Stat icon={Wrench} label={t("fleetPage.maintenanceBuses")} value={counts.maintenance} tone="text-warning-foreground" />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("fleetPage.status")}</span>
        <button
          onClick={() => setStatus(null)}
          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${
            status === null ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"
          }`}
        >
          {t("fleetPage.all")}
        </button>
        {(Object.keys(STATUS_TONE) as BusStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${
              status === s ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:bg-muted"
            }`}
          >
            {t(`fleetPage.statuses.${s}`)}
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-border" />
        <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("fleetPage.route")}</span>
        <button
          onClick={() => setRouteId(null)}
          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${
            routeId === null ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"
          }`}
        >
          {t("fleetPage.all")}
        </button>
        {routeOptions.map((r) => (
          <button
            key={r.id}
            onClick={() => setRouteId(r.id)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              routeId === r.id ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:bg-muted"
            }`}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />
            {r.number}
          </button>
        ))}
      </div>

      <div className="hairline-top mt-6 overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-[var(--shadow-soft)]">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3.5 font-semibold">{t("fleetPage.bus")}</th>
              <th className="px-5 py-3.5 font-semibold">{t("fleetPage.plate")}</th>
              <th className="hidden px-5 py-3.5 font-semibold md:table-cell">{t("fleetPage.driver")}</th>
              <th className="px-5 py-3.5 font-semibold">{t("fleetPage.route")}</th>
              <th className="hidden px-5 py-3.5 font-semibold sm:table-cell">{t("fleetPage.seats")}</th>
              <th className="px-5 py-3.5 font-semibold">{t("fleetPage.status")}</th>
              <th className="px-5 py-3.5 font-semibold">{t("fleetPage.onTime")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((b) => {
              const r = getRoute(b.routeId);
              return (
                <tr key={b.id} className="hover:bg-muted/50">
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{b.id}</td>
                  <td className="px-5 py-3.5 font-semibold">{b.plate}</td>
                  <td className="hidden px-5 py-3.5 md:table-cell">{b.driver}</td>
                  <td className="px-5 py-3.5">
                    {r && (
                      <Link
                        href={`/routes/${r.id}`}
                        className="inline-flex items-center gap-2 rounded-md px-2 py-0.5 font-mono text-[11px] font-bold text-white transition-transform hover:scale-105"
                        style={{ background: r.color }}
                      >
                        {r.number}
                      </Link>
                    )}
                  </td>
                  <td className="hidden px-5 py-3.5 sm:table-cell">{b.capacity}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ${STATUS_TONE[b.status]}`}>
                      {t(`fleetPage.statuses.${b.status}`)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${b.onTimeRate}%` }} />
                      </div>
                      <span className="font-semibold tabular-nums">{b.onTimeRate}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">{t("fleetPage.noResults")}</div>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone?: string;
}) {
  return (
    <div className="hairline-top rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className={`h-4 w-4 ${tone ?? "text-primary"}`} /> {label}
      </div>
      <div className="mt-2 font-display text-3xl font-bold tracking-tight">{value}</div>
    </div>
  );
}
