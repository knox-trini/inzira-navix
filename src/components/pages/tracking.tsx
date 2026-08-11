"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { routes, KIGALI_CENTER, type Coord, type Route as TRoute } from "@/data/kigali";
import { MapView } from "@/components/MapView";
import { useRequireAuth } from "@/hooks/useRequireAuth";

function pointAlong(path: Coord[], t: number): Coord {
  if (path.length < 2) return path[0];
  const total = path.length - 1;
  const pos = Math.min(Math.max(t, 0), 1) * total;
  const i = Math.floor(pos);
  const f = pos - i;
  const a = path[i];
  const b = path[Math.min(i + 1, total)];
  return { lat: a.lat + (b.lat - a.lat) * f, lng: a.lng + (b.lng - a.lng) * f };
}

type Bus = { id: string; route: TRoute; progress: number; speed: number };

function makeFleet(): Bus[] {
  const fleet: Bus[] = [];
  for (const r of routes) {
    const buses = Math.max(1, Math.round(60 / r.frequencyMin));
    for (let i = 0; i < buses; i++) {
      fleet.push({
        id: `${r.id}-${i}`,
        route: r,
        progress: (i / buses + Math.random() * 0.05) % 1,
        speed: 0.0035 + Math.random() * 0.0025,
      });
    }
  }
  return fleet;
}

export function TrackingPage() {
  const { t } = useTranslation();
  const ready = useRequireAuth();
  const [fleet, setFleet] = useState<Bus[]>(() => makeFleet());
  const [filterId, setFilterId] = useState<string | null>(null);

  useEffect(() => {
    const tk = setInterval(() => {
      setFleet((prev) =>
        prev.map((b) => {
          let p = b.progress + b.speed;
          if (p > 1) p = 0;
          return { ...b, progress: p };
        }),
      );
    }, 1500);
    return () => clearInterval(tk);
  }, []);

  const visible = filterId ? fleet.filter((b) => b.route.id === filterId) : fleet;
  const visibleRoutes = filterId ? routes.filter((r) => r.id === filterId) : routes;

  const markers = useMemo(
    () =>
      visible.map((b) => ({
        id: b.id,
        coord: pointAlong(b.route.path, b.progress),
        label: b.route.number,
        color: b.route.color,
      })),
    [visible],
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
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            <span className="h-px w-8 bg-primary" />
            {t("tracking.eyebrow")}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="inline-flex items-center gap-3">
              <span className="relative grid h-3 w-3 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-success/60" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-success" />
              </span>
              {t("tracking.busesMoving", { count: visible.length })}
            </span>
          </h1>
          <p className="mt-3 text-muted-foreground">{t("tracking.body")}</p>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterId(null)}
          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${filterId === null ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"}`}
        >
          {t("tracking.allRoutes")}
        </button>
        {routes.map((r) => (
          <button
            key={r.id}
            onClick={() => setFilterId(r.id)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              filterId === r.id ? "border-foreground bg-foreground text-background" : "border-border bg-card hover:bg-muted"
            }`}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />
            {r.number}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <MapView
          center={KIGALI_CENTER}
          zoom={12}
          routes={visibleRoutes}
          liveMarkers={markers}
          height="620px"
        />
      </div>
    </div>
  );
}
