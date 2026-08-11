"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { stations, routes, getStation, getRoute } from "@/data/kigali";
import { MapView } from "@/components/MapView";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { ArrowRight, Clock, Banknote, Repeat } from "lucide-react";

type Plan = {
  legs: { routeId: string; from: string; to: string; minutes: number }[];
  totalMin: number;
  totalFare: number;
  transfers: number;
};

function planTrip(fromId: string, toId: string): Plan[] {
  if (!fromId || !toId || fromId === toId) return [];
  const plans: Plan[] = [];

  for (const r of routes) {
    const i = r.stopIds.indexOf(fromId);
    const j = r.stopIds.indexOf(toId);
    if (i !== -1 && j !== -1 && i !== j) {
      const steps = Math.abs(j - i);
      const minutes = Math.round((r.durationMin / Math.max(r.stopIds.length - 1, 1)) * steps) + Math.ceil(r.frequencyMin / 2);
      plans.push({
        legs: [{ routeId: r.id, from: fromId, to: toId, minutes }],
        totalMin: minutes,
        totalFare: r.fareRwf,
        transfers: 0,
      });
    }
  }

  for (const r1 of routes) {
    if (!r1.stopIds.includes(fromId)) continue;
    for (const r2 of routes) {
      if (r1.id === r2.id) continue;
      if (!r2.stopIds.includes(toId)) continue;
      const shared = r1.stopIds.find((id) => r2.stopIds.includes(id) && id !== fromId && id !== toId);
      if (!shared) continue;
      const i1 = r1.stopIds.indexOf(fromId), j1 = r1.stopIds.indexOf(shared);
      const i2 = r2.stopIds.indexOf(shared), j2 = r2.stopIds.indexOf(toId);
      const leg1 = Math.round((r1.durationMin / Math.max(r1.stopIds.length - 1, 1)) * Math.abs(j1 - i1)) + Math.ceil(r1.frequencyMin / 2);
      const leg2 = Math.round((r2.durationMin / Math.max(r2.stopIds.length - 1, 1)) * Math.abs(j2 - i2)) + Math.ceil(r2.frequencyMin / 2) + 4;
      plans.push({
        legs: [
          { routeId: r1.id, from: fromId, to: shared, minutes: leg1 },
          { routeId: r2.id, from: shared, to: toId, minutes: leg2 },
        ],
        totalMin: leg1 + leg2,
        totalFare: r1.fareRwf + r2.fareRwf,
        transfers: 1,
      });
    }
  }

  return plans.sort((a, b) => a.totalMin - b.totalMin).slice(0, 4);
}

export function PlannerPage() {
  const { t } = useTranslation();
  const ready = useRequireAuth();
  const [from, setFrom] = useState(stations[0].id);
  const [to, setTo] = useState(stations[2].id);

  const plans = useMemo(() => planTrip(from, to), [from, to]);

  function swap() {
    setFrom(to); setTo(from);
  }

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
      <header className="max-w-2xl">
        <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
          <span className="h-px w-8 bg-primary" />
          {t("planner.eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{t("planner.title")}</h1>
        <p className="mt-3 text-muted-foreground">{t("planner.body")}</p>
      </header>

      <div className="mt-8 grid gap-3 rounded-2xl border border-border/80 bg-card p-3 shadow-[var(--shadow-soft)] sm:grid-cols-[1fr_auto_1fr]">
        <Field label={t("planner.from")} value={from} onChange={setFrom} />
        <button
          onClick={swap}
          className="grid h-10 w-10 place-self-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground"
          aria-label={t("planner.swap")}
        >
          <Repeat className="m-auto h-4 w-4" />
        </button>
        <Field label={t("planner.to")} value={to} onChange={setTo} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display text-2xl font-bold">{t("planner.options", { count: plans.length })}</h2>
          {plans.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-8 text-sm text-muted-foreground">
              {t("planner.none")}
            </div>
          )}
          {plans.map((p, idx) => (
            <article key={idx} className={`hairline-top rounded-2xl border p-5 shadow-[var(--shadow-soft)] ${idx === 0 ? "border-primary bg-primary-soft" : "border-border/80 bg-card"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-display text-2xl font-bold text-foreground">{p.totalMin}<span className="text-xs font-medium"> min</span></span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" /> {t("planner.total")}</span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground"><Banknote className="h-3 w-3" /> {p.totalFare} RWF</span>
                </div>
                {idx === 0 && <span className="rounded-lg bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">{t("planner.fastest")}</span>}
              </div>
              <div className="mt-4 space-y-2">
                {p.legs.map((leg, i) => {
                  const r = getRoute(leg.routeId)!;
                  return (
                    <div key={i} className="flex items-center gap-3 rounded-xl bg-background p-3">
                      <div className="grid h-9 w-12 place-items-center rounded-lg font-mono text-sm font-bold text-white" style={{ background: r.color }}>
                        {r.number}
                      </div>
                      <div className="min-w-0 flex-1 text-sm">
                        <div className="truncate">{getStation(leg.from)?.name} <ArrowRight className="inline h-3 w-3 text-muted-foreground" /> {getStation(leg.to)?.name}</div>
                        <div className="text-xs text-muted-foreground">{t("planner.legMinEvery", { minutes: leg.minutes, freq: r.frequencyMin })}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {p.transfers > 0 && <p className="mt-3 text-xs text-muted-foreground">{t("planner.includesTransfer", { count: p.transfers })}</p>}
            </article>
          ))}
        </div>

        <div className="lg:col-span-3">
          <MapView
            center={getStation(from)?.coord ?? stations[0].coord}
            zoom={12}
            stations={stations.filter((s) => s.id === from || s.id === to)}
            routes={plans[0] ? plans[0].legs.map((l) => getRoute(l.routeId)!) : []}
            height="540px"
          />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block rounded-xl bg-background px-4 py-3">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full bg-transparent text-base font-semibold outline-none"
      >
        {stations.map((s) => (
          <option key={s.id} value={s.id}>{s.name} — {s.area}</option>
        ))}
      </select>
    </label>
  );
}
