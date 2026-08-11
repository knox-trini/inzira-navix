"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { stations, routes, getRoute, etaMinutes, distanceKm, KIGALI_CENTER, type Coord } from "@/data/kigali";
import { MapView } from "@/components/MapView";
import { MapPin, Navigation2, Loader2 } from "lucide-react";

export function StationsPage() {
  const { t } = useTranslation();
  const [origin, setOrigin] = useState<Coord>(KIGALI_CENTER);
  const [usingGeo, setUsingGeo] = useState(false);
  const [geoErr, setGeoErr] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(stations[0]?.id ?? null);

  const sorted = useMemo(() => {
    return [...stations]
      .map((s) => ({ ...s, distance: distanceKm(origin, s.coord) }))
      .sort((a, b) => a.distance - b.distance);
  }, [origin]);

  const selected = sorted.find((s) => s.id === selectedId) ?? sorted[0];

  function useMyLocation() {
    if (!("geolocation" in navigator)) {
      setGeoErr(t("stations.geoUnsupported"));
      return;
    }
    setUsingGeo(true);
    setGeoErr(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setUsingGeo(false);
      },
      (err) => {
        setGeoErr(err.message || t("stations.geoError"));
        setUsingGeo(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            <span className="h-px w-8 bg-primary" />
            {t("stations.eyebrow")}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">{t("stations.title")}</h1>
          <p className="mt-3 text-muted-foreground">{t("stations.body")}</p>
        </div>
        <button
          onClick={useMyLocation}
          className="press inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
          disabled={usingGeo}
        >
          {usingGeo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation2 className="h-4 w-4" />}
          {t("stations.useLocation")}
        </button>
      </header>
      {geoErr && <p className="mt-3 text-sm text-destructive">{geoErr}</p>}

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-3">
          {sorted.map((s) => {
            const isActive = s.id === selected?.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={`hairline-top w-full rounded-2xl border p-5 text-left transition-all duration-300 ${
                  isActive ? "border-primary bg-primary-soft shadow-[var(--shadow-panel)]" : "border-border/80 bg-card shadow-[var(--shadow-soft)] hover:border-primary/40 hover:shadow-[var(--shadow-panel)]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.area}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg font-bold">{s.distance.toFixed(1)}<span className="text-xs font-medium text-muted-foreground"> km</span></div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("stations.walking")}</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.routes.slice(0, 4).map((rid) => {
                    const r = getRoute(rid)!;
                    return (
                      <span key={rid} className="rounded-md px-2 py-0.5 font-mono text-[11px] font-bold text-white" style={{ background: r.color }}>
                        {r.number}
                      </span>
                    );
                  })}
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <MapView
            center={selected?.coord ?? KIGALI_CENTER}
            zoom={13}
            stations={stations}
            routes={selected ? routes.filter((r) => selected.routes.includes(r.id)) : []}
            highlightStationId={selected?.id}
            height="380px"
          />
          {selected && (
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {selected.area}
              </div>
              <h2 className="mt-1 font-display text-2xl font-bold">{selected.name}</h2>
              {selected.facilities && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selected.facilities.map((f) => (
                    <span key={f} className="rounded-lg bg-muted px-2.5 py-1 text-xs">{f}</span>
                  ))}
                </div>
              )}
              <h3 className="mt-6 text-sm font-semibold">{t("stations.nextArrivals")}</h3>
              <ArrivalsList stationId={selected.id} routeIds={selected.routes} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ArrivalsList({ stationId, routeIds }: { stationId: string; routeIds: string[] }) {
  const { t } = useTranslation();
  const [, setTick] = useState(0);
  useEffect(() => {
    const tk = setInterval(() => setTick((x) => x + 1), 30_000);
    return () => clearInterval(tk);
  }, []);
  const rows = routeIds
    .map((rid) => ({ route: getRoute(rid)!, eta: etaMinutes(stationId, rid) }))
    .sort((a, b) => a.eta - b.eta);
  return (
    <div className="mt-3 divide-y divide-border rounded-xl border border-border/80 shadow-sm">
      {rows.map(({ route, eta }) => (
        <div key={route.id} className="flex items-center justify-between gap-3 p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-12 place-items-center rounded-lg font-mono text-sm font-bold text-white" style={{ background: route.color }}>
              {route.number}
            </div>
            <div>
              <div className="text-sm font-medium">{t("stations.toward", { name: route.to })}</div>
              <div className="text-xs text-muted-foreground">{route.operator}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-lg font-bold text-primary">{eta} min</div>
          </div>
        </div>
      ))}
    </div>
  );
}
