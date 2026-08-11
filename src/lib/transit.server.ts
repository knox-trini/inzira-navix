// Server-side transit data service.
//
// This module is the "backend" layer of the platform. It reads the shared
// Kigali transit dataset and shapes it for the HTTP API. In a production
// deployment this is where a real database (PostgreSQL/MongoDB) or a live
// GTFS feed would be queried instead of the in-memory mock dataset.
//
// The `.server.ts` suffix keeps this module out of client bundles.

import {
  routes,
  stations,
  updates,
  fleet,
  routePredictions,
  ticketProducts,
  notificationFeed,
  hourRidership,
  operatorStats,
  networkLevel,
  currentLevelFor,
  routeOnTimeRate,
  etaMinutes,
  type CongestionLevel,
} from "@/data/kigali";

export type NetworkStatus = {
  level: CongestionLevel;
  activeRoutes: number;
  activeBuses: number;
  totalBuses: number;
  onTimeRate: number;
  generatedAt: string;
};

export function getNetworkStatus(): NetworkStatus {
  const activeBuses = fleet.filter((b) => b.status === "active").length;
  const onTime = Math.round(
    routes.reduce((a, r) => a + routeOnTimeRate(r.id), 0) / Math.max(routes.length, 1),
  );
  return {
    level: networkLevel(new Date()),
    activeRoutes: routes.length,
    activeBuses,
    totalBuses: fleet.length,
    onTimeRate: onTime,
    generatedAt: new Date().toISOString(),
  };
}

export function getAnalytics() {
  const ridership = hourRidership.reduce((a, h) => a + h.ridership, 0);
  const onTime = Math.round(
    routes.reduce((a, r) => a + routeOnTimeRate(r.id), 0) / Math.max(routes.length, 1),
  );
  return {
    kpis: {
      dailyRidership: ridership,
      activeRoutes: routes.length,
      operators: operatorStats.length,
      onTimeRate: onTime,
      busesOnRoad: fleet.filter((b) => b.status === "active").length,
    },
    ridershipByHour: hourRidership,
    operatorTrips: operatorStats,
    routePerformance: routes.map((r) => ({
      id: r.id,
      number: r.number,
      name: r.name,
      operator: r.operator,
      color: r.color,
      onTime: routeOnTimeRate(r.id),
      congestion: currentLevelFor(r.id, new Date()),
    })),
    network: getNetworkStatus(),
  };
}

export const api = {
  routes,
  stations,
  updates,
  fleet,
  predictions: routePredictions,
  tickets: ticketProducts,
  notifications: notificationFeed,
  etaMinutes,
  getNetworkStatus,
  getAnalytics,
};

export default api;
