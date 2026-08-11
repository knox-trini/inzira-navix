"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { routes, getPrediction, currentLevelFor, networkLevel, type CongestionLevel } from "@/data/kigali";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Activity, CarFront, Clock3, TriangleAlert, type LucideIcon } from "lucide-react";

const LEVEL_COLORS: Record<CongestionLevel, string> = {
  free: "#22c55e",
  light: "#84cc16",
  moderate: "#f59e0b",
  heavy: "#f97316",
  severe: "#ef4444",
};

const LEVEL_DOT: Record<CongestionLevel, string> = {
  free: "bg-success",
  light: "bg-success",
  moderate: "bg-warning",
  heavy: "bg-warning",
  severe: "bg-destructive",
};

const LEVEL_TONE: Record<CongestionLevel, string> = {
  free: "bg-success/15 text-success-foreground",
  light: "bg-success/15 text-success-foreground",
  moderate: "bg-warning/20 text-warning-foreground",
  heavy: "bg-warning/20 text-warning-foreground",
  severe: "bg-destructive/15 text-destructive-foreground",
};

const ORDER: CongestionLevel[] = ["free", "light", "moderate", "heavy", "severe"];

export function PredictionsPage() {
  const { t } = useTranslation();
  const ready = useRequireAuth();
  const [selectedId, setSelectedId] = useState(routes[0].id);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tk = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(tk);
  }, []);

  const prediction = useMemo(() => getPrediction(selectedId), [selectedId]);
  const forecast = useMemo(() => prediction?.forecast ?? [], [prediction]);
  const chartData = useMemo(
    () => forecast.map((f) => ({ hour: f.hour, speed: f.speedKmh, level: f.level })),
    [forecast],
  );
  const worst = useMemo(
    () => forecast.reduce((a, b) => (ORDER.indexOf(b.level) > ORDER.indexOf(a.level) ? b : a), forecast[0]),
    [forecast],
  );
  const routeLevel = currentLevelFor(selectedId, now);
  const network = networkLevel(now);

  const config = {
    speed: { label: t("predictions.kmh"), color: "var(--chart-1)" },
  } satisfies ChartConfig;

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
          {t("predictions.eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{t("predictions.title")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("predictions.body")}</p>
      </header>

      <div className="hairline-top mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-4">
          <span className="relative flex h-3.5 w-3.5">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${LEVEL_DOT[network]}`} />
            <span className={`relative inline-flex h-3.5 w-3.5 rounded-full ${LEVEL_DOT[network]}`} />
          </span>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("predictions.networkStatus")}
            </div>
            <div className="font-display text-2xl font-bold">{t(`analytics.levels.${network}`)}</div>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${LEVEL_TONE[network]}`}>
          <Activity className="h-3.5 w-3.5" />
          {t(`analytics.levels.${network}`)}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {routes.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedId(r.id)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              selectedId === r.id ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:bg-muted"
            }`}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />
            {r.number}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <section className="hairline-top rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-display text-xl font-bold tracking-tight">{t("predictions.forecastTitle")}</h2>
            <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">{t("predictions.forecastBody")}</p>
            <div className="mt-6">
              <ChartContainer config={config} className="h-72">
                <BarChart data={chartData} margin={{ left: -16, right: 8 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="hour"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(h: number) => `${String(h).padStart(2, "0")}:00`}
                  />
                  <YAxis domain={[0, 50]} tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="speed" radius={[3, 3, 0, 0]}>
                    {chartData.map((d) => (
                      <Cell key={d.hour} fill={LEVEL_COLORS[d.level]} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("predictions.legendTitle")}
              </span>
              {ORDER.map((l) => (
                <span key={l} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: LEVEL_COLORS[l] }} />
                  {t(`analytics.levels.${l}`)}
                </span>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <FactCard
            icon={Clock3}
            label={t("predictions.routeStatus")}
            value={t(`analytics.levels.${routeLevel}`)}
            level={routeLevel}
          />
          <FactCard
            icon={CarFront}
            label={t("predictions.hotSpot")}
            value={prediction?.hotSpot ?? "—"}
            body={t("predictions.hotSpotBody")}
          />
          <FactCard
            icon={TriangleAlert}
            label={t("predictions.worstHour")}
            value={worst ? `${String(worst.hour).padStart(2, "0")}:00` : "—"}
            body={t("predictions.worstHourBody")}
            level={worst?.level}
          />
        </div>
      </div>
    </div>
  );
}

function FactCard({
  icon: Icon,
  label,
  value,
  body,
  level,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  body?: string;
  level?: CongestionLevel;
}) {
  const { t } = useTranslation();
  return (
    <div className="hairline-top rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" /> {label}
      </div>
      <div className="mt-3 font-display text-2xl font-bold">{value}</div>
      {level && (
        <span className={`mt-3 inline-block rounded-lg px-2.5 py-1 text-[11px] font-semibold ${LEVEL_TONE[level]}`}>
          {t(`analytics.levels.${level}`)}
        </span>
      )}
      {body && <p className="mt-2 text-sm text-muted-foreground">{body}</p>}
    </div>
  );
}
