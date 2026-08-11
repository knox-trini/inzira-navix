
// Mock Kigali public transport dataset.
// Routes and stops are approximations to support the MVP UX.
// In production these would come from a transit API (GTFS feed).

export type Coord = { lat: number; lng: number };

export type Station = {
  id: string;
  name: string;
  area: string;
  coord: Coord;
  routes: string[]; // route ids serving this station
  facilities?: string[];
};

export type Route = {
  id: string;
  number: string; // bus number
  name: string;
  operator: string;
  color: string; // hex
  from: string;
  to: string;
  frequencyMin: number;
  firstBus: string;
  lastBus: string;
  fareRwf: number;
  durationMin: number;
  stopIds: string[];
  path: Coord[]; // polyline
};

export const KIGALI_CENTER: Coord = { lat: -1.9536, lng: 30.0606 };

export type Place = {
  id: string;
  name: string;
  kind: "terminal" | "neighborhood" | "landmark" | "district" | "airport";
  coord: Coord;
};

// Known places (neighborhoods, landmarks, districts, terminals) used to resolve
// a tapped location to a human-readable name. In production this would come
// from OpenStreetMap / Nominatim or a point-of-interest service.
export const places: Place[] = [
  { id: "p-nyabugogo", name: "Nyabugogo", kind: "terminal", coord: { lat: -1.9398, lng: 30.0428 } },
  { id: "p-downtown", name: "Downtown Kigali", kind: "district", coord: { lat: -1.9499, lng: 30.0588 } },
  { id: "p-kimironko", name: "Kimironko", kind: "neighborhood", coord: { lat: -1.9356, lng: 30.1217 } },
  { id: "p-nyamirambo", name: "Nyamirambo", kind: "neighborhood", coord: { lat: -1.9806, lng: 30.0399 } },
  { id: "p-remera", name: "Remera", kind: "neighborhood", coord: { lat: -1.9577, lng: 30.1106 } },
  { id: "p-airport", name: "Kigali International Airport", kind: "airport", coord: { lat: -1.9686, lng: 30.1391 } },
  { id: "p-kigaliheights", name: "Kigali Heights", kind: "landmark", coord: { lat: -1.9516, lng: 30.1016 } },
  { id: "p-kacyiru", name: "Kacyiru", kind: "district", coord: { lat: -1.9385, lng: 30.0814 } },
  { id: "p-gisozi", name: "Gisozi", kind: "neighborhood", coord: { lat: -1.9197, lng: 30.0703 } },
  { id: "p-kicukiro", name: "Kicukiro", kind: "district", coord: { lat: -1.9826, lng: 30.0916 } },
  { id: "p-gikondo", name: "Gikondo", kind: "neighborhood", coord: { lat: -1.9758, lng: 30.0731 } },
  { id: "p-kanombe", name: "Kanombe", kind: "neighborhood", coord: { lat: -1.9686, lng: 30.1391 } },
];

export const stations: Station[] = [
  { id: "nyabugogo", name: "Nyabugogo Bus Terminal", area: "Nyarugenge", coord: { lat: -1.9398, lng: 30.0428 }, routes: ["r1", "r2", "r4", "r5"], facilities: ["Toilets", "Ticket office", "Shelter"] },
  { id: "downtown", name: "Downtown (CBD)", area: "Nyarugenge", coord: { lat: -1.9499, lng: 30.0588 }, routes: ["r1", "r3", "r5"], facilities: ["Shelter", "Lighting"] },
  { id: "kimironko", name: "Kimironko Terminal", area: "Gasabo", coord: { lat: -1.9356, lng: 30.1217 }, routes: ["r2", "r3", "r6"], facilities: ["Toilets", "Ticket office"] },
  { id: "remera", name: "Remera Bus Park", area: "Gasabo", coord: { lat: -1.9577, lng: 30.1106 }, routes: ["r2", "r6"], facilities: ["Shelter"] },
  { id: "kicukiro", name: "Kicukiro Centre", area: "Kicukiro", coord: { lat: -1.9826, lng: 30.0916 }, routes: ["r3", "r4"], facilities: ["Shelter", "Lighting"] },
  { id: "nyamirambo", name: "Nyamirambo", area: "Nyarugenge", coord: { lat: -1.9806, lng: 30.0399 }, routes: ["r5"], facilities: ["Shelter"] },
  { id: "kacyiru", name: "Kacyiru", area: "Gasabo", coord: { lat: -1.9385, lng: 30.0814 }, routes: ["r1", "r6"], facilities: ["Shelter", "Lighting"] },
  { id: "gisozi", name: "Gisozi", area: "Gasabo", coord: { lat: -1.9197, lng: 30.0703 }, routes: ["r4"], facilities: ["Shelter"] },
  { id: "kanombe", name: "Kanombe (Airport)", area: "Kicukiro", coord: { lat: -1.9686, lng: 30.1391 }, routes: ["r6"], facilities: ["Shelter", "Lighting", "Ticket office"] },
  { id: "gikondo", name: "Gikondo", area: "Kicukiro", coord: { lat: -1.9758, lng: 30.0731 }, routes: ["r4"], facilities: ["Shelter"] },
];

export const routes: Route[] = [
  {
    id: "r1", number: "302", name: "Nyabugogo – Kacyiru – Downtown", operator: "Royal Express",
    color: "#0c8a7a", from: "Nyabugogo", to: "Downtown", frequencyMin: 10,
    firstBus: "05:30", lastBus: "22:30", fareRwf: 350, durationMin: 28,
    stopIds: ["nyabugogo", "kacyiru", "downtown"],
    path: [{ lat: -1.9398, lng: 30.0428 }, { lat: -1.9385, lng: 30.0814 }, { lat: -1.9499, lng: 30.0588 }],
  },
  {
    id: "r2", number: "304", name: "Nyabugogo – Remera – Kimironko", operator: "Kigali Bus Services",
    color: "#d97706", from: "Nyabugogo", to: "Kimironko", frequencyMin: 8,
    firstBus: "05:00", lastBus: "23:00", fareRwf: 400, durationMin: 42,
    stopIds: ["nyabugogo", "remera", "kimironko"],
    path: [{ lat: -1.9398, lng: 30.0428 }, { lat: -1.9577, lng: 30.1106 }, { lat: -1.9356, lng: 30.1217 }],
  },
  {
    id: "r3", number: "318", name: "Kimironko – Downtown – Kicukiro", operator: "Royal Express",
    color: "#2563eb", from: "Kimironko", to: "Kicukiro", frequencyMin: 12,
    firstBus: "05:45", lastBus: "22:00", fareRwf: 450, durationMin: 55,
    stopIds: ["kimironko", "downtown", "kicukiro"],
    path: [{ lat: -1.9356, lng: 30.1217 }, { lat: -1.9499, lng: 30.0588 }, { lat: -1.9826, lng: 30.0916 }],
  },
  {
    id: "r4", number: "207", name: "Gisozi – Nyabugogo – Gikondo – Kicukiro", operator: "Kigali Bus Services",
    color: "#7c3aed", from: "Gisozi", to: "Kicukiro", frequencyMin: 15,
    firstBus: "06:00", lastBus: "21:30", fareRwf: 450, durationMin: 48,
    stopIds: ["gisozi", "nyabugogo", "gikondo", "kicukiro"],
    path: [{ lat: -1.9197, lng: 30.0703 }, { lat: -1.9398, lng: 30.0428 }, { lat: -1.9758, lng: 30.0731 }, { lat: -1.9826, lng: 30.0916 }],
  },
  {
    id: "r5", number: "112", name: "Nyamirambo – Downtown – Nyabugogo", operator: "Volcano Express",
    color: "#ef4444", from: "Nyamirambo", to: "Nyabugogo", frequencyMin: 9,
    firstBus: "05:15", lastBus: "22:45", fareRwf: 350, durationMin: 32,
    stopIds: ["nyamirambo", "downtown", "nyabugogo"],
    path: [{ lat: -1.9806, lng: 30.0399 }, { lat: -1.9499, lng: 30.0588 }, { lat: -1.9398, lng: 30.0428 }],
  },
  {
    id: "r6", number: "322", name: "Kimironko – Remera – Kacyiru – Kanombe", operator: "Royal Express",
    color: "#0d9488", from: "Kimironko", to: "Kanombe", frequencyMin: 20,
    firstBus: "05:30", lastBus: "21:00", fareRwf: 500, durationMin: 50,
    stopIds: ["kimironko", "remera", "kacyiru", "kanombe"],
    path: [{ lat: -1.9356, lng: 30.1217 }, { lat: -1.9577, lng: 30.1106 }, { lat: -1.9385, lng: 30.0814 }, { lat: -1.9686, lng: 30.1391 }],
  },
];

export type TransportUpdate = {
  id: string;
  type: "delay" | "info" | "incident" | "service";
  routeIds: string[];
  title: string;
  body: string;
  postedAt: string; // ISO
};

export const updates: TransportUpdate[] = [
  { id: "u1", type: "delay", routeIds: ["r2"], title: "Route 304 — 10 min delay near Remera", body: "Heavy traffic on KG 11 Ave. Expect 8–12 min delays in both directions.", postedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
  { id: "u2", type: "service", routeIds: ["r6"], title: "Extra buses to Kanombe Airport", body: "Two additional buses deployed on Route 322 for evening peak.", postedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: "u3", type: "incident", routeIds: ["r3"], title: "Minor accident cleared on KN 5 Rd", body: "Route 318 resumed normal operation. Residual delays clearing.", postedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: "u4", type: "info", routeIds: ["r1", "r5"], title: "Downtown stop relocated temporarily", body: "Downtown CBD stop moved 80m east due to road works until Friday.", postedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
];

export function getStation(id: string) {
  return stations.find((s) => s.id === id);
}
export function getRoute(id: string) {
  return routes.find((r) => r.id === id);
}

// ---------------------------------------------------------------------------
// Notifications (Phase 2 — notification center)
// ---------------------------------------------------------------------------

export type NotificationChannel = "delay" | "incident" | "service" | "eta";

export type NotificationPreference = {
  channel: NotificationChannel;
  enabled: boolean;
};

export const defaultNotificationPreferences: NotificationPreference[] = [
  { channel: "delay", enabled: true },
  { channel: "incident", enabled: true },
  { channel: "service", enabled: true },
  { channel: "eta", enabled: true },
];

export type AppNotification = {
  id: string;
  type: "delay" | "incident" | "service" | "info" | "eta";
  title: string;
  body: string;
  routeId?: string;
  postedAt: string; // ISO
};

const NOTIFICATION_FEED: AppNotification[] = [
  { id: "nt-eta-1", type: "eta", title: "Route 304 arrives in 4 min", body: "Bus RAD 314 A is approaching Kimironko Terminal.", routeId: "r2", postedAt: new Date(Date.now() - 1000 * 60 * 6).toISOString() },
  { id: "nt-delay-1", type: "delay", title: "Route 112 — heavy congestion on KN 5 Rd", body: "Average speed dropped to 14 km/h. Expect 10–15 min delays.", routeId: "r5", postedAt: new Date(Date.now() - 1000 * 60 * 28).toISOString() },
  { id: "nt-eta-2", type: "eta", title: "Route 302 arrives in 2 min", body: "Bus RAD 225 C is approaching Nyabugogo Bus Terminal.", routeId: "r1", postedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString() },
  { id: "nt-service-1", type: "service", title: "Extra buses to Kanombe Airport", body: "Two additional buses deployed on Route 322 for evening peak.", routeId: "r6", postedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  ...updates.map((u, i) => ({
    id: `nt-update-${i}`,
    type: u.type,
    title: u.title,
    body: u.body,
    routeId: u.routeIds[0],
    postedAt: u.postedAt,
  })),
];

export const notificationFeed: AppNotification[] = NOTIFICATION_FEED;


// Deterministic pseudo-random for ETAs based on station+route+minute bucket.
export function etaMinutes(stationId: string, routeId: string, now = new Date()): number {
  const bucket = Math.floor(now.getTime() / 60000);
  const key = `${stationId}-${routeId}-${bucket}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  const r = getRoute(routeId);
  const base = r ? r.frequencyMin : 12;
  return (h % base) + 1;
}

export function distanceKm(a: Coord, b: Coord): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

// Deterministic pseudo-random number in [0, 1) from a string seed.
// Used to simulate analytics so renders stay pure and stable.
export function seededRand(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 10000 / 10000;
}

// ---------------------------------------------------------------------------
// Fleet (Phase 3 — fleet management)
// ---------------------------------------------------------------------------

export type BusStatus = "active" | "idle" | "maintenance";

export type BusUnit = {
  id: string;
  routeId: string;
  plate: string;
  driver: string;
  capacity: number;
  status: BusStatus;
  onTimeRate: number; // percent
};

const FLEET_PLATES = ["RAD 314 A", "RAD 225 C", "RAE 108 K", "RAD 442 B", "RAE 771 F", "RAC 903 H", "RAE 228 J", "RAD 517 D", "RAE 634 M", "RAD 809 N"];
const FLEET_DRIVERS = [
  "Jean Bosco N.",
  "Alice Uwase",
  "Eric Mugenzi",
  "Sandrine Uwera",
  "Patrick Niyonzima",
  "Clarisse Mukamana",
  "Olivier Habimana",
  "Diane Ingabire",
  "Emmanuel Rutayisire",
  "Bella Umutoni",
];

export const fleet: BusUnit[] = routes.flatMap((r, ri) =>
  Array.from({ length: 3 }, (_, i) => {
    const k = ri * 3 + i;
    const status: BusStatus = k % 6 === 0 ? "maintenance" : k % 4 === 0 ? "idle" : "active";
    return {
      id: `bus-${r.id}-${i + 1}`,
      routeId: r.id,
      plate: FLEET_PLATES[k % FLEET_PLATES.length],
      driver: FLEET_DRIVERS[k % FLEET_DRIVERS.length],
      capacity: 32 + ((ri + i) % 3) * 8,
      status,
      onTimeRate: 78 + ((ri * 7 + i * 13) % 19),
    };
  }),
);

export function getBus(id: string) {
  return fleet.find((b) => b.id === id);
}

// ---------------------------------------------------------------------------
// AI traffic predictions (Phase 3)
// ---------------------------------------------------------------------------

export type CongestionLevel = "free" | "light" | "moderate" | "heavy" | "severe";

export type HourForecast = { hour: number; level: CongestionLevel; speedKmh: number };

export type RoutePrediction = {
  routeId: string;
  hotSpot: string;
  forecast: HourForecast[];
};

const CONGESTION_LEVELS: CongestionLevel[] = ["free", "light", "moderate", "heavy", "severe"];

const LEVEL_SPEED: Record<CongestionLevel, number> = {
  free: 42,
  light: 34,
  moderate: 25,
  heavy: 17,
  severe: 11,
};

const HOT_SPOTS = [
  "Kacyiru roundabout",
  "KG 11 Ave near Remera",
  "KN 5 Rd junction",
  "Gikondo corridor",
  "Nyamirambo main road",
  "Airport approach Rd",
];

function levelForHour(hour: number, seed: number): CongestionLevel {
  let score = 0;
  if (hour >= 6 && hour <= 9) score += 3;
  if (hour >= 16 && hour <= 19) score += 3;
  if (hour >= 12 && hour <= 14) score += 1;
  if (hour >= 20 && hour <= 21) score += 1;
  if (hour < 6 || hour >= 22) score -= 1;
  const variance = Math.floor(((seed * 7 + hour * 13) % 10) - 5); // -5..4
  score += variance >= 4 ? 1 : variance <= -4 ? -1 : 0;
  score = Math.max(0, Math.min(4, score));
  return CONGESTION_LEVELS[score];
}

export const routePredictions: RoutePrediction[] = routes.map((r, i) => ({
  routeId: r.id,
  hotSpot: HOT_SPOTS[i % HOT_SPOTS.length],
  forecast: Array.from({ length: 24 }, (_, hour) => {
    const level = levelForHour(hour, i + 1);
    return { hour, level, speedKmh: LEVEL_SPEED[level] };
  }),
}));

export function getPrediction(routeId: string) {
  return routePredictions.find((p) => p.routeId === routeId);
}

export function currentLevelFor(routeId: string, now: Date): CongestionLevel {
  const p = getPrediction(routeId);
  return p?.forecast[now.getHours()]?.level ?? "moderate";
}

export function networkLevel(now: Date): CongestionLevel {
  const hour = now.getHours();
  const scores = routePredictions.map((p) => CONGESTION_LEVELS.indexOf(p.forecast[hour]?.level ?? "moderate"));
  const avg = scores.reduce((a, b) => a + b, 0) / Math.max(scores.length, 1);
  return CONGESTION_LEVELS[Math.round(avg)];
}

// ---------------------------------------------------------------------------
// Digital ticketing (Phase 3)
// ---------------------------------------------------------------------------

export type TicketProduct = {
  id: string;
  type: "single" | "day" | "week" | "month" | "express";
  name: string;
  priceRwf: number;
  validFor: string;
  description: string;
  accent: string;
};

export const ticketProducts: TicketProduct[] = [
  {
    id: "t-single",
    type: "single",
    name: "Single ride",
    priceRwf: 300,
    validFor: "1 trip",
    description: "One-way ride on any local route.",
    accent: "#0c8a7a",
  },
  {
    id: "t-day",
    type: "day",
    name: "Day pass",
    priceRwf: 1200,
    validFor: "24 hours",
    description: "Unlimited rides across all routes for a full day.",
    accent: "#2563eb",
  },
  {
    id: "t-week",
    type: "week",
    name: "Weekly pass",
    priceRwf: 6500,
    validFor: "7 days",
    description: "Best value for daily commuters — 7 days of unlimited travel.",
    accent: "#7c3aed",
  },
  {
    id: "t-month",
    type: "month",
    name: "Monthly pass",
    priceRwf: 22000,
    validFor: "30 days",
    description: "Everything a daily commuter needs for a full month.",
    accent: "#d97706",
  },
  {
    id: "t-express",
    type: "express",
    name: "Airport express",
    priceRwf: 2500,
    validFor: "1 trip",
    description: "Direct non-stop service to Kanombe International Airport.",
    accent: "#ef4444",
  },
];

export function getTicketProduct(id: string) {
  return ticketProducts.find((p) => p.id === id);
}

export type PurchasedTicket = {
  code: string;
  productId: string;
  purchasedAt: string; // ISO
  validUntil: string; // ISO
  ownerEmail: string;
};

export function issueTicketCode(): string {
  const rand = Math.floor(Math.random() * 1_000_000_000)
    .toString(36)
    .toUpperCase();
  return `INZ-${rand.slice(0, 6)}-${rand.slice(6, 9)}`;
}

// ---------------------------------------------------------------------------
// Simulated analytics (Phase 2 — analytics systems)
// ---------------------------------------------------------------------------

export type HourStat = { hour: number; ridership: number };

export const hourRidership: HourStat[] = Array.from({ length: 24 }, (_, hour) => ({
  hour,
  ridership: Math.round(300 + 2400 * Math.max(0, 1 - Math.abs(hour - 8) / 7) * 0.55 + 2400 * Math.max(0, 1 - Math.abs(hour - 18) / 7) * 0.65 + seededRand(`ridership-${hour}`) * 260),
}));

export type OperatorStat = {
  operator: string;
  trips: number;
  color: string;
};

export const operatorStats: OperatorStat[] = ["Royal Express", "Kigali Bus Services", "Volcano Express", "Omega Car", "Capital Bus", "Stella Express"].map((op, i) => {
  const r = routes.filter((x) => x.operator === op);
  const base = r.length > 0 ? r.reduce((a, x) => a + Math.round(420 / x.frequencyMin), 0) : 60;
  return {
    operator: op,
    trips: base + Math.round(seededRand(`operator-${op}`) * 120),
    color: r[0]?.color ?? ["#0c8a7a", "#d97706", "#2563eb", "#7c3aed", "#ef4444", "#0d9488"][i],
  };
});

export function routeOnTimeRate(routeId: string): number {
  const r = getRoute(routeId);
  if (!r) return 90;
  return Math.round(86 + seededRand(`ontime-${routeId}`) * 12 - seededRand(`delay-${routeId}`) * 4);
}
