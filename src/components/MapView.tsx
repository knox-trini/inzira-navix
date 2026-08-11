"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { Crosshair, Globe, Map as MapIcon, Search, Sparkles, X } from "lucide-react";
import { places, routes as allRoutes, stations as allStations, type Coord, type Route, type Station } from "@/data/kigali";
import { nearestStation, recommendTo, resolveLocationName, type MobilityRecommendation } from "@/lib/mobility";
import { MobilityPanel } from "@/components/MobilityPanel";

type Props = {
  center: Coord;
  zoom?: number;
  stations?: Station[];
  routes?: Route[];
  liveMarkers?: { id: string; coord: Coord; label: string; color: string }[];
  height?: string;
  highlightStationId?: string;
};

type Mode = "globe" | "normal";

type Snapshot = { mode: Mode; webgl: boolean };

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("webgl2"))
    );
  } catch {
    return false;
  }
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const STORAGE_KEY = "inzira-map-mode";

let snapshot: Snapshot | null = null;
let listeners: Array<() => void> = [];

function computeSnapshot(): Snapshot {
  const webgl = typeof window === "undefined" ? true : hasWebGL();
  let pref: Mode | null = null;
  if (typeof window !== "undefined") {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "globe" || saved === "normal") pref = saved;
    } catch {
      /* ignore */
    }
  }
  return { mode: webgl ? pref ?? "globe" : "normal", webgl };
}

function getSnapshot() {
  if (!snapshot) snapshot = computeSnapshot();
  return snapshot;
}

const SERVER_SNAPSHOT: Snapshot = { mode: "globe", webgl: true };

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function setMode(mode: Mode) {
  if (!snapshot) snapshot = computeSnapshot();
  snapshot = { ...snapshot, mode };
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function useMapMode() {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
}

// Client-only map wrapper. The 3D globe needs WebGL, so we dynamically import
// and fall back to a standard flat map when WebGL is unavailable, when the user
// chooses it, or for anyone who can't use the globe.
export function MapView(props: Props) {
  const { t } = useTranslation();
  const { mode, webgl } = useMapMode();
  const [globeMod, setGlobeMod] = useState<null | typeof import("./GlobeInner")>(null);
  const [normalMod, setNormalMod] = useState<null | typeof import("./MapInner")>(null);
  const [destination, setDestination] = useState<Coord | null>(null);
  const [origin, setOrigin] = useState<Coord | null>(null);
  const [focus, setFocus] = useState<Coord | null>(null);
  const [recommendation, setRecommendation] = useState<MobilityRecommendation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<Station | typeof places[number]>>([]);
  const [routeFilter, setRouteFilter] = useState<string | null>(null);
  const [liveTrackingEnabled, setLiveTrackingEnabled] = useState(true);
  const [highlightStationId, setHighlightStationId] = useState<string | null>(props.highlightStationId ?? null);
  const [selectedLocationLabel, setSelectedLocationLabel] = useState<string | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(props.zoom ?? 13);

  useEffect(() => {
    let active = true;
    Promise.all([import("./GlobeInner"), import("./MapInner")]).then(([g, m]) => {
      if (active) {
        setGlobeMod(g);
        setNormalMod(m);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const searchItems = useMemo(() => [...allStations, ...places], []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const scored = searchItems
      .map((item) => {
        const name = item.name.toLowerCase();
        let score = 999;

        if (name === query) score = 0;
        else if (name.startsWith(query)) score = 1;
        else if (name.includes(` ${query}`) || name.includes(`${query} `)) score = 2;
        else if (name.includes(query)) score = 4;

        if ("routes" in item) {
          if (item.area.toLowerCase() === query) score = Math.min(score, 3);
          item.routes.forEach((routeId) => {
            const route = allRoutes.find((r) => r.id === routeId);
            if (!route) return;
            const routeNumber = route.number.toLowerCase();
            const routeName = route.name.toLowerCase();
            if (routeNumber === query) score = Math.min(score, 0);
            else if (routeNumber.startsWith(query)) score = Math.min(score, 1);
            else if (routeNumber.includes(query)) score = Math.min(score, 2);
            else if (routeName.includes(query)) score = Math.min(score, 3);
          });
        }

        if (!("routes" in item)) {
          const kindPriority = item.kind === "terminal" ? 0 : item.kind === "airport" ? 0 : item.kind === "landmark" ? 1 : item.kind === "neighborhood" ? 2 : item.kind === "district" ? 3 : 5;
          score += kindPriority;
        }

        return { item, score };
      })
      .filter((entry) => entry.score < 999)
      .sort((a, b) => a.score - b.score)
      .slice(0, 8)
      .map((entry) => entry.item);

    setSearchResults(scored);
    setShowSearchResults(true);
  }, [searchItems, searchQuery]);

  function chooseMode(m: Mode) {
    if (m === "globe" && !webgl) return;
    setMode(m);
  }

  function handleDestinationChange(c: Coord) {
    const rec = recommendTo(c);
    const resolvedName = rec?.destination.label ?? resolveLocationName(c) ?? t("mobility.selectedLocation");
    setDestination(c);
    setFocus(c);
    setRecommendation(rec);
    setSelectedLocationLabel(resolvedName);
    setShowSearchResults(false);
  }

  function handleSearchResult(item: Station | typeof places[number]) {
    const rec = recommendTo(item.coord);
    const resolvedName = rec?.destination.label ?? item.name;
    setDestination(item.coord);
    setFocus(item.coord);
    setRecommendation(rec);
    setSelectedLocationLabel(resolvedName);
    setSearchQuery(item.name);
    setShowSearchResults(false);

    if ("routes" in item) {
      setHighlightStationId(item.id);
    } else {
      const near = nearestStation(item.coord, { maxKm: 3 });
      setHighlightStationId(near?.id ?? null);
    }
  }

  function locateMe() {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: Coord = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setOrigin(loc);
        setFocus(loc);
      },
      () => {
        /* permission denied or unavailable — ignore */
      },
      { enableHighAccuracy: true }
    );
  }

  function clearDestination() {
    setDestination(null);
    setFocus(null);
    setRecommendation(null);
    setSelectedLocationLabel(null);
  }

  function zoomIn() {
    setZoomLevel((current) => Math.min(current + 1, 18));
  }

  function zoomOut() {
    setZoomLevel((current) => Math.max(current - 1, 2));
  }

  if (!globeMod || !normalMod) {
    return (
      <div
        className="map-dark relative w-full overflow-hidden rounded-2xl border border-border/80"
        style={{ height: props.height ?? "480px" }}
      >
        <div className="absolute inset-0 bg-[#0b1713]" />
        <div className="absolute inset-0 map-grid" />
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex items-center gap-2 rounded-full border border-emerald-200/20 bg-[#0b1713]/85 px-4 py-2 text-xs font-medium text-emerald-200 shadow-[0_8px_20px_rgba(0,0,0,.4)] backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
            Loading map…
          </div>
        </div>
      </div>
    );
  }

  const reducedMotion = prefersReducedMotion();
  const selectedLabel = recommendation?.destination.label ?? selectedLocationLabel ?? (destination ? resolveLocationName(destination) : null);
  const availableRoutes = props.routes?.length ? props.routes : allRoutes;
  const visibleRoutes = routeFilter ? availableRoutes.filter((route) => route.id === routeFilter) : availableRoutes;
  const activeLiveMarkers = liveTrackingEnabled ? props.liveMarkers ?? [] : [];

  const shared = {
    ...props,
    origin,
    destination,
    focus,
    recommendation,
    selectedLocationLabel: selectedLabel,
    onDestinationChange: handleDestinationChange,
    routes: visibleRoutes,
    highlightStationId: highlightStationId ?? props.highlightStationId,
    liveMarkers: activeLiveMarkers,
    zoom: zoomLevel,
  };

  return (
    <div className="relative">
      <div className="absolute left-6 top-6 z-[1100] w-[min(440px,calc(100%-48px))] rounded-[1.25rem] border border-border/70 bg-white/95 p-4 shadow-[0_18px_40px_rgba(0,0,0,.12)] backdrop-blur-sm transition-all sm:w-[min(460px,calc(100%-48px))]">
        <div className="relative flex items-center gap-3 rounded-[1.25rem] border border-border/70 bg-white px-4 py-3 shadow-sm transition-all focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-200/60">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onFocus={() => {
              setShowSearchResults(true);
              setSearchFocused(true);
            }}
            onBlur={() => setSearchFocused(false)}
            placeholder={t("map.searchPlaceholder")}
            aria-label={t("map.searchPlaceholder")}
            className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label={t("map.clearSearch")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {showSearchResults && (searchResults.length > 0 || searchQuery) && (
          <div className="mt-3 max-h-[320px] overflow-y-auto rounded-[1.25rem] border border-border/70 bg-white p-2 shadow-[0_18px_40px_rgba(0,0,0,.08)]">
            {searchResults.length > 0 ? (
              searchResults.map((item) => (
                <button
                  key={"routes" in item ? item.id : item.id}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSearchResult(item)}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-foreground transition hover:bg-slate-50"
                >
                  <span>{item.name}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-muted-foreground">
                    {"routes" in item ? t("map.station") : item.kind}
                  </span>
                </button>
              ))
            ) : (
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>{t("map.searchNoResults")}</div>
                <div>{t("map.searchPrompt")}</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="absolute right-3 top-3 z-[1000] flex flex-col items-end gap-3">
        <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/90 p-1 shadow-[var(--shadow-soft)] backdrop-blur" role="group" aria-label="Map view">
          <button
            type="button"
            onClick={() => chooseMode("globe")}
            aria-pressed={mode === "globe"}
            title="3D globe view"
            className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors ${
              mode === "globe"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground disabled:opacity-40"
            }`}
            disabled={!webgl}
          >
            <Globe className="h-3.5 w-3.5" />
            Globe
          </button>
          <button
            type="button"
            onClick={() => chooseMode("normal")}
            aria-pressed={mode === "normal"}
            title="Standard map"
            className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors ${
              mode === "normal"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MapIcon className="h-3.5 w-3.5" />
            Map
          </button>
        </div>

        <div className="rounded-3xl border border-border/70 bg-background/90 p-3 shadow-[var(--shadow-soft)] backdrop-blur">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">{t("map.routes")}</span>
            <button
              type="button"
              onClick={() => setRouteFilter(null)}
              className="rounded-full border border-border/70 px-3 py-1 text-xs font-semibold text-muted-foreground transition hover:bg-muted"
            >
              {t("map.allRoutes")}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allRoutes.map((route) => (
              <button
                key={route.id}
                type="button"
                onClick={() => setRouteFilter((current) => (current === route.id ? null : route.id))}
                className={`rounded-2xl px-3 py-2 text-xs font-semibold transition ${
                  routeFilter === route.id
                    ? "bg-foreground text-background"
                    : "bg-card text-muted-foreground hover:bg-muted"
                }`}
                style={{ borderColor: route.color, color: routeFilter === route.id ? "" : route.color }}
              >
                {route.number}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedLabel && (
        <div className="absolute left-3 top-[160px] z-[1000] w-[min(92vw,320px)] rounded-3xl border border-emerald-300/20 bg-[#08120e]/95 px-4 py-3 shadow-[var(--shadow-soft)] text-emerald-100 backdrop-blur">
          <div className="text-[11px] uppercase tracking-[0.28em] text-emerald-200/70">{t("map.selectedLocation")}</div>
          <div className="mt-2 text-base font-semibold leading-tight">{selectedLabel}</div>
        </div>
      )}

      {mode === "globe" ? (
        <globeMod.GlobeInner {...shared} autoRotate={!reducedMotion} />
      ) : (
        <normalMod.MapInner {...shared} />
      )}

      <div className="absolute left-3 bottom-4 right-3 z-[1100]">
        <MobilityPanel rec={recommendation} onClear={clearDestination} />
      </div>
    </div>
  );
}
