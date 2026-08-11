"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  fleet,
  hourRidership,
  operatorStats,
  routes,
  routeOnTimeRate,
  currentLevelFor,
  networkLevel,
  type CongestionLevel,
  type HourStat,
  type OperatorStat,
} from "@/data/kigali";
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Activity, Building2, Bus, CalendarClock, Clock3, Route as RouteIcon, Users, type LucideIcon } from "lucide-react";

const LEVEL_TONE: Record<CongestionLevel, string> = {
  free: "bg-success/15 text-success-foreground",
  light: "bg-success/15 text-success-foreground",
  moderate: "bg-warning/20 text-warning-foreground",
  heavy: "bg-destructive/15 text-destructive-foreground",
  severe: "bg-destructive/20 text-destructive-foreground",
};

const LEVEL_DOT: Record<CongestionLevel, string> = {
  free: "bg-success",
  light: "bg-success",
  moderate: "bg-warning",
  heavy: "bg-destructive",
  severe: "bg-destructive",
};

function onTimeBar(rate: number): string {
  if (rate >= 90) return "bg-success";
  if (rate >= 85) return "bg-warning";
  return "bg-destructive";
}

function onTimeText(rate: number): string {
  if (rate >= 90) return "text-success";
  if (rate >= 85) return "text-warning-foreground";
  return "text-destructive";
}

export function AnalyticsPage() {
  const { t } = useTranslation();
  const ready = useRequireAuth();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tk = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(tk);
  }, []);

  const kpis = useMemo(() => {
    const ridership = hourRidership.reduce((a, h) => a + h.ridership, 0);
    const onTime = Math.round(routes.reduce((a, r) => a + routeOnTimeRate(r.id), 0) / Math.max(routes.length, 1));
    return {
      ridership,
      routes: routes.length,
      operators: operatorStats.length,
      onTime,
      buses: fleet.filter((b) => b.status === "active").length,
    };
  }, []);

  const level = networkLevel(now);

  const onTimeData = useMemo(
    () =>
      routes
        .map((r) => ({ id: r.id, number: r.number, name: r.name, color: r.color, onTime: routeOnTimeRate(r.id) }))
        .sort((a, b) => b.onTime - a.onTime),
    [],
  );

  const rows = useMemo(
    () =>
      routes.map((r) => ({
        id: r.id,
        number: r.number,
        name: r.name,
        operator: r.operator,
        color: r.color,
        onTime: routeOnTimeRate(r.id),
        level: currentLevelFor(r.id, now),
      })),
    [now],
  );

  const ridershipConfig = {
    ridership: { label: t("analytics.riders"), color: "var(--chart-1)" },
  } satisfies ChartConfig;

  const operatorConfig = {
    trips: { label: t("analytics.tripsPerDay") },
  } satisfies ChartConfig;

  const ops = useMemo(() => [...operatorStats].sort((a, b) => b.trips - a.trips), []);
  const totalTrips = useMemo(() => ops.reduce((a, o) => a + o.trips, 0), [ops]);

  const onTimeConfig = {
    onTime: { label: t("analytics.onTime") },
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
          {t("analytics.eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{t("analytics.title")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("analytics.body")}</p>
      </header>

      <div className="hairline-top mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-4">
          <span className="relative flex h-3.5 w-3.5">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${LEVEL_DOT[level]}`} />
            <span className={`relative inline-flex h-3.5 w-3.5 rounded-full ${LEVEL_DOT[level]}`} />
          </span>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("analytics.networkStatus")}
            </div>
            <div className="font-display text-2xl font-bold">{t(`analytics.levels.${level}`)}</div>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${LEVEL_TONE[level]}`}>
          <Activity className="h-3.5 w-3.5" />
          {t(`analytics.levels.${level}`)}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Kpi icon={Users} label={t("analytics.dailyRidership")} value={kpis.ridership.toLocaleString()} hint={t("analytics.ridersPerDay")} />
        <Kpi icon={RouteIcon} label={t("analytics.activeRoutes")} value={kpis.routes} />
        <Kpi icon={Building2} label={t("analytics.operatorsTracked")} value={kpis.operators} />
        <Kpi icon={Clock3} label={t("analytics.onTimeRate")} value={`${kpis.onTime}%`} />
        <Kpi icon={Bus} label={t("analytics.busesOnRoad")} value={kpis.buses} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title={t("analytics.ridershipByHour")} body={t("analytics.ridershipByHourBody")} className="lg:col-span-2">
          <ChartContainer config={ridershipConfig} className="h-72">
            <AreaChart data={hourRidership} margin={{ left: -16, right: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(h: number) => `${String(h).padStart(2, "0")}:00`}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<RidershipTooltip />} />
              <Area
                dataKey="ridership"
                type="monotone"
                stroke="var(--color-ridership)"
                fill="var(--color-ridership)"
                fillOpacity={0.22}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ChartContainer>
        </Panel>

        <Panel title={t("analytics.operatorTrips")} body={t("analytics.operatorTripsBody")}>
          <ChartContainer config={operatorConfig} className="h-80">
            <BarChart data={ops} layout="vertical" margin={{ left: 0, right: 12 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.14)]}
              />
              <YAxis
                type="category"
                dataKey="operator"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={136}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip content={<OperatorTooltip />} cursor={{ fill: "var(--color-muted)" }} />
              <Bar
                dataKey="trips"
                radius={[0, 6, 6, 0]}
                barSize={22}
                label={{ position: "right", fontSize: 11, fill: "var(--color-muted-foreground)" }}
              >
                {ops.map((op) => (
                  <Cell key={op.operator} fill={op.color} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/40 px-4 py-3">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarClock className="h-4 w-4 shrink-0 text-primary" />
              {t("analytics.dailyDepartures")}
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-bold tabular-nums text-foreground">
                {totalTrips.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">
                {ops.length} {t("analytics.operatorsTracked").toLowerCase()}
              </span>
            </span>
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title={t("analytics.onTimeByRoute")} body={t("analytics.onTimeByRouteBody")}>
          <ChartContainer config={onTimeConfig} className="h-72">
            <BarChart data={onTimeData} margin={{ left: -16, right: 8, top: 26 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="number" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v: number) => `${v}%`} />
              <ChartTooltip content={<OnTimeTooltip />} cursor={{ fill: "var(--color-muted)" }} />
              <Bar
                dataKey="onTime"
                radius={[6, 6, 0, 0]}
                barSize={26}
                label={{ position: "top", fontSize: 11, fill: "var(--color-muted-foreground)", formatter: (v: number) => `${v}%` }}
              >
                {onTimeData.map((d) => (
                  <Cell key={d.id} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </Panel>

        <Panel title={t("analytics.routeTable")}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 pr-3 font-semibold">{t("analytics.route")}</th>
                  <th className="pb-3 pr-3 font-semibold">{t("analytics.name")}</th>
                  <th className="hidden pb-3 pr-3 font-semibold md:table-cell">{t("analytics.operator")}</th>
                  <th className="pb-3 pr-3 font-semibold">{t("analytics.onTime")}</th>
                  <th className="pb-3 font-semibold">{t("analytics.congestion")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/50">
                    <td className="py-3 pr-3">
                      <Link
                        href={`/routes/${r.id}`}
                        className="grid h-9 w-12 place-items-center rounded-lg font-mono text-sm font-bold text-white transition-transform hover:scale-105"
                        style={{ background: r.color }}
                      >
                        {r.number}
                      </Link>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="font-medium">{r.name}</div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground md:hidden">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: r.color }} />
                        {r.operator}
                      </div>
                    </td>
                    <td className="hidden py-3 pr-3 text-xs text-muted-foreground md:table-cell">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: r.color }} />
                        {r.operator}
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-14 overflow-hidden rounded-full bg-muted">
                          <div className={`h-full rounded-full ${onTimeBar(r.onTime)}`} style={{ width: `${r.onTime}%` }} />
                        </div>
                        <span className={`font-semibold tabular-nums ${onTimeText(r.onTime)}`}>{r.onTime}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold ${LEVEL_TONE[r.level]}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${LEVEL_DOT[r.level]}`} />
                        {t(`analytics.levels.${r.level}`)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="hairline-top rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" /> {label}
      </div>
      <div className="mt-2 font-display text-3xl font-bold tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function RidershipTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ value?: number; payload?: HourStat }>;
}) {
  const { t } = useTranslation();
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const hour = item.payload?.hour;
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      <div className="font-semibold text-foreground">
        {typeof hour === "number" ? `${String(hour).padStart(2, "0")}:00` : ""}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1.5 font-mono text-base font-bold tabular-nums text-primary">
        {(item.value ?? 0).toLocaleString()}
        <span className="text-[11px] font-medium text-muted-foreground">{t("analytics.riders")}</span>
      </div>
    </div>
  );
}

function OnTimeTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ value?: number; payload?: { number: string; name: string; color: string } }>;
}) {
  const { t } = useTranslation();
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const r = item.payload;
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      {r && (
        <div className="flex items-center gap-2">
          <span
            className="grid h-5 w-8 place-items-center rounded-md font-mono text-[11px] font-bold text-white"
            style={{ background: r.color }}
          >
            {r.number}
          </span>
          <span className="font-semibold text-foreground">{r.name}</span>
        </div>
      )}
      <div className="mt-1.5 flex items-baseline gap-1.5 font-mono text-base font-bold tabular-nums text-foreground">
        {typeof item.value === "number" ? `${item.value}%` : "—"}
        <span className="text-[11px] font-medium text-muted-foreground">{t("analytics.onTime")}</span>
      </div>
    </div>
  );
}

function OperatorTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ value?: number; payload?: OperatorStat }>;
}) {
  const { t } = useTranslation();
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const op = item.payload;
  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl">
      {op && (
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: op.color }} />
          <span className="font-semibold text-foreground">{op.operator}</span>
        </div>
      )}
      <div className="mt-1.5 font-mono text-base font-bold tabular-nums text-foreground">
        {(item.value ?? 0).toLocaleString()}
        <span className="ml-1.5 text-[11px] font-medium text-muted-foreground">{t("analytics.tripsPerDay")}</span>
      </div>
    </div>
  );
}

function Panel({
  title,
  body,
  className,
  children,
}: {
  title: string;
  body?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`hairline-top rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--shadow-soft)] ${className ?? ""}`}>
      <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
      {body && <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">{body}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}
