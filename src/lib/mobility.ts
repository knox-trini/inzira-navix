
// ---------------------------------------------------------------------------
// Kigali Smart Mobility service layer
// ---------------------------------------------------------------------------
// A modular, dependency-light mobility engine. It resolves a tapped point to
// the nearest station, recommends the best route to a destination, estimates
// travel time and ETA, and reports live congestion + transfer options.
//
// Designed to be swapped for real services later without reshaping the UI:
//   - GTFS feed  -> replace `stations` / `routes`
//   - GPS feed   -> replace the deterministic `liveBuses` simulation
//   - OpenStreetMap -> replace the nearest-point geometry
//   - AI model   -> replace `recommendRoute` / `predictTraffic`
// Every public function here is pure and unit-testable.
// ---------------------------------------------------------------------------

import {
  stations,
  routes,
  places,
  getStation,
  distanceKm,
  currentLevelFor,
  type Coord,
  type Place,
  type Route,
  type Station,
} from "@/data/kigali";

export type CongestionLevel = "free" | "light" | "moderate" | "heavy" | "severe";

export type LiveBus = {
  id: string;
  routeId: string;
  routeNumber: string;
  coord: Coord;
  direction: "inbound" | "outbound";
  progress: number; // 0..1 along the route path
  speedKmh: number;
  heading: number;
  nextStop: string;
  occupancy: "low" | "medium" | "high";
};

export type MobilityRoute = {
  routeId: string;
  routeNumber: string;
  name: string;
  color: string;
  operator: string;
};

export type MobilityRecommendation = {
  origin: { coord: Coord; label: string };
  destination: { coord: Coord; label: string };
  nearestStation: { id: string; label: string; walkKm: number };
  route?: MobilityRoute;
  viaTransfer?: MobilityRoute;
  isTransfer: boolean;
  etaMin: number;
  travelMin: number;
  waitMin: number;
  fareRwf: number;
  transfers: number;
  congestion: CongestionLevel;
  summary: string;
};

// -- nearest station ---------------------------------------------------------

export function nearestStation(coord: Coord, opts?: { maxKm?: number }): Station | null {
  const max = opts?.maxKm ?? 2.2;
  let best: Station | null = null;
  let bestD = Infinity;
  for (const s of stations) {
    const d = distanceKm(coord, s.coord);
    if (d < bestD) {
      bestD = d;
      best = s;
    }
  }
  return best && bestD <= max ? best : null;
}

// -- route resolution --------------------------------------------------------

export function routeForStations(aId: string, bId: string): Route | null {
  for (const r of routes) {
    const i = r.stopIds.indexOf(aId);
    const j = r.stopIds.indexOf(bId);
    if (i !== -1 && j !== -1 && i !== j) return r;
  }
  return null;
}

export function servingRoutes(stationId: string): Route[] {
  return routes.filter((r) => r.stopIds.includes(stationId));
}

// -- transfer search ---------------------------------------------------------

export function viaTransfer(fromId: string, toId: string): { first: Route; via: Station; second: Route } | null {
  for (const r1 of routes) {
    if (!r1.stopIds.includes(fromId)) continue;
    for (const r2 of routes) {
      if (r1.id === r2.id) continue;
      if (!r2.stopIds.includes(toId)) continue;
      const shared = r1.stopIds.find((id) => r2.stopIds.includes(id) && id !== fromId && id !== toId);
      if (!shared) continue;
      return { first: r1, via: getStation(shared)!, second: r2 };
    }
  }
  return null;
}

// -- travel time / ETA -------------------------------------------------------

function legMinutes(route: Route, fromId: string, toId: string): number {
  const i = route.stopIds.indexOf(fromId);
  const j = route.stopIds.indexOf(toId);
  const steps = Math.abs(j - i);
  return Math.round((route.durationMin / Math.max(route.stopIds.length - 1, 1)) * steps) + Math.ceil(route.frequencyMin / 2);
}

export function estimateTravel(startId: string, destId: string, now = new Date()) {
  const direct = routeForStations(startId, destId);
  if (direct) {
    const travelMin = legMinutes(direct, startId, destId);
    const waitMin = Math.ceil(direct.frequencyMin / 2);
    return {
      route: direct,
      via: null as Station | null,
      isTransfer: false,
      travelMin,
      waitMin,
      etaMin: waitMin + travelMin,
      fareRwf: direct.fareRwf,
      transfers: 0,
      congestion: currentLevelFor(direct.id, now),
    };
  }

  const via = viaTransfer(startId, destId);
  if (via) {
    const t1 = legMinutes(via.first, startId, via.via.id);
    const t2 = legMinutes(via.second, via.via.id, destId);
    const waitMin = Math.ceil(via.first.frequencyMin / 2) + Math.ceil(via.second.frequencyMin / 2) + 4;
    return {
      route: via.first,
      via: via.via as Station | null,
      isTransfer: true,
      travelMin: t1 + t2,
      waitMin,
      etaMin: waitMin + t1 + t2,
      fareRwf: via.first.fareRwf + via.second.fareRwf,
      transfers: 1,
      congestion: currentLevelFor(via.first.id, now),
    };
  }

  return null;
}

// -- destination recommendation (the core globe feature) ---------------------

export function recommendTo(coord: Coord, now = new Date()): MobilityRecommendation | null {
  const destinationDetail = resolveLocationDetail(coord);
  const dest = destinationDetail.nearestStationId
    ? getStation(destinationDetail.nearestStationId)
    : nearestStation(coord, { maxKm: 2.2 });
  if (!dest) return null;

  const destinationLabel = destinationDetail.name || "Selected location";
  const nearestStationLabel = dest.name;
  const walkKm = distanceKm(coord, dest.coord);

  // Origin defaults to the nearest station to Kigali centre (CBD) so the globe
  // always has a sensible "from" when the user taps a destination.
  const originStation = nearestStation({ lat: -1.9499, lng: 30.0588 }, { maxKm: 3 }) ?? dest;
  const est = estimateTravel(originStation.id, dest.id, now);

  if (!est) return null;

  const summary = est.isTransfer && est.via
    ? `${est.route.number} + ${est.via.name} → ${destinationLabel}`
    : `${est.route.number} → ${destinationLabel}`;

  return {
    origin: { coord: originStation.coord, label: originStation.name },
    destination: { coord: dest.coord, label: destinationLabel },
    nearestStation: { id: dest.id, label: nearestStationLabel, walkKm },
    route: { routeId: est.route.id, routeNumber: est.route.number, name: est.route.name, color: est.route.color, operator: est.route.operator },
    viaTransfer: est.via ? { routeId: est.route.id, routeNumber: est.route.number, name: est.route.name, color: est.route.color, operator: est.route.operator } : undefined,
    isTransfer: est.isTransfer,
    etaMin: est.etaMin,
    travelMin: est.travelMin,
    waitMin: est.waitMin,
    fareRwf: est.fareRwf,
    transfers: est.transfers,
    congestion: est.congestion,
    summary,
  };
}

// -- location name resolution ------------------------------------------------

export function nearestPlace(coord: Coord, opts?: { maxKm?: number }): Place | null {
  const max = opts?.maxKm ?? 3;
  let best: Place | null = null;
  let bestD = Infinity;
  for (const p of places) {
    const d = distanceKm(coord, p.coord);
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  return best && bestD <= max ? best : null;
}

// Which place kinds are "better" when several are close. Lower = higher priority.
const PLACE_PRIORITY: Record<Place["kind"], number> = {
  terminal: 0,
  landmark: 1,
  airport: 1,
  neighborhood: 2,
  district: 3,
};

export type LocationDetail = {
  name: string;
  matchedKind?: Place["kind"] | "station";
  nearestStationId?: string;
  walkKm?: number;
  isFallback?: boolean;
};

// Resolves a tapped/located coordinate to a human-readable name plus the
// nearest station + walking distance (used by the destination info card).
// Priority per spec: exact station -> terminal/landmark/airport -> neighborhood
// -> district -> "Selected location" fallback.
export function resolveLocationDetail(coord: Coord): LocationDetail {
  const station = nearestStation(coord, { maxKm: 1.2 });
  if (station) {
    return {
      name: station.name,
      matchedKind: "station",
      nearestStationId: station.id,
      walkKm: distanceKm(coord, station.coord),
    };
  }

  // Prefer the highest-priority place within range, then the closest place.
  let best: Place | null = null;
  let bestPriority = Infinity;
  let bestD = Infinity;
  for (const p of places) {
    const d = distanceKm(coord, p.coord);
    if (d > 3) continue;
    const prio = PLACE_PRIORITY[p.kind];
    if (prio < bestPriority || (prio === bestPriority && d < bestD)) {
      best = p;
      bestPriority = prio;
      bestD = d;
    }
  }
  if (best && bestD <= 3) {
    return { name: best.name, matchedKind: best.kind };
  }

  return { name: "", isFallback: true };
}

// Resolves a tapped coordinate to a human-readable location name.
// Priority: exact station -> terminal/landmark/airport -> neighborhood -> district.
export function resolveLocationName(coord: Coord): string | null {
  const detail = resolveLocationDetail(coord);
  return detail.name && !detail.isFallback ? detail.name : null;
}

// -- simulated live buses (future GPS feed) ----------------------------------

export function liveBuses(now = new Date()): LiveBus[] {
  const out: LiveBus[] = [];
  for (const r of routes) {
    const count = Math.max(1, Math.round(60 / r.frequencyMin));
    for (let i = 0; i < count; i++) {
      const progress = (i / count + (now.getMinutes() % 10) / 12) % 1;
      const t = progress;
      const total = r.path.length - 1;
      const pos = Math.min(Math.max(t, 0), 1) * total;
      const idx = Math.floor(pos);
      const f = pos - idx;
      const a = r.path[Math.min(idx, total)];
      const b = r.path[Math.min(idx + 1, total)];
      const coord: Coord = { lat: a.lat + (b.lat - a.lat) * f, lng: a.lng + (b.lng - a.lng) * f };
      const stopIdx = Math.min(Math.ceil(idx), r.stopIds.length - 1);
      const nextStop = getStation(r.stopIds[stopIdx])?.name ?? r.to;
      const congestion = currentLevelFor(r.id, now);
      const speedMap: Record<CongestionLevel, number> = { free: 42, light: 34, moderate: 25, heavy: 17, severe: 11 };
      out.push({
        id: `${r.id}-${i}`,
        routeId: r.id,
        routeNumber: r.number,
        coord,
        direction: progress < 0.5 ? "inbound" : "outbound",
        progress,
        speedKmh: speedMap[congestion],
        heading: ((i * 47) % 360),
        nextStop,
        occupancy: i % 3 === 0 ? "high" : i % 3 === 1 ? "medium" : "low",
      });
    }
  }
  return out;
}
