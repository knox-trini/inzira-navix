"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { getStation, etaMinutes, stations as allStations, type Route } from "@/data/kigali";
import { MapView } from "@/components/MapView";
import { ArrowLeft, Clock, MapPin, Banknote, Calendar } from "lucide-react";

export function RouteDetailPage({ route }: { route: Route }) {
  const { t } = useTranslation();
  const stops = route.stopIds.map((id: string) => getStation(id)!).filter(Boolean);
  const center = stops[Math.floor(stops.length / 2)]?.coord ?? route.path[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <Link href="/routes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {t("routeDetail.back")}
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="grid h-16 w-20 place-items-center rounded-2xl font-mono text-2xl font-bold text-white shadow-[var(--shadow-soft)]" style={{ background: route.color }}>
            {route.number}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{route.operator}</p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">{route.name}</h1>
            <p className="mt-1 text-muted-foreground">{route.from} → {route.to}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: Clock, label: t("routeDetail.frequency"), value: `${route.frequencyMin} min` },
            { icon: Calendar, label: t("routeDetail.hours"), value: `${route.firstBus}–${route.lastBus}` },
            { icon: Banknote, label: t("routeDetail.fare"), value: `${route.fareRwf} RWF` },
            { icon: MapPin, label: t("routeDetail.duration"), value: `${route.durationMin} min` },
          ].map((s) => (
            <div key={s.label} className="hairline-top rounded-xl border border-border/80 bg-card p-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <s.icon className="h-3.5 w-3.5" /> {s.label}
              </div>
              <div className="mt-1 font-display text-lg font-bold">{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <MapView center={center} zoom={12} stations={stops} routes={[route]} height="520px" />
        </div>
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl font-bold">{t("routeDetail.stopsTitle")}</h2>
          <ol className="relative mt-6 space-y-0 border-l-2 pl-6" style={{ borderColor: route.color }}>
            {stops.map((s, i) => {
              const eta = etaMinutes(s.id, route.id);
              const isFirst = i === 0, isLast = i === stops.length - 1;
              return (
                <li key={s.id} className="relative pb-6 last:pb-0">
                  <span className="absolute -left-[33px] grid h-6 w-6 place-items-center rounded-full border-2 border-background" style={{ background: route.color }}>
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </span>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">
                        {isFirst ? t("routeDetail.origin") : isLast ? t("routeDetail.destination") : t("routeDetail.stopN", { n: i + 1 })}
                      </div>
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.area}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-xl font-bold text-primary">{eta}<span className="text-xs font-medium text-muted-foreground"> {t("routeDetail.min")}</span></div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("routeDetail.nextBus")}</div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="hairline-top mt-8 rounded-2xl border border-border/80 bg-card p-5 shadow-[var(--shadow-soft)]">
            <h3 className="text-sm font-semibold">{t("routeDetail.alsoServing")}</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {allStations
                .filter((s) => s.routes.includes(route.id) && !route.stopIds.includes(s.id))
                .map((s) => (
                  <Link key={s.id} href="/stations" className="rounded-lg bg-muted px-3 py-1 text-xs hover:bg-primary-soft hover:text-primary">
                    {s.name}
                  </Link>
                ))}
              {allStations.filter((s) => s.routes.includes(route.id) && !route.stopIds.includes(s.id)).length === 0 && (
                <span className="text-xs text-muted-foreground">{t("routeDetail.noAdditional")}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
