import { NextResponse } from "next/server";

import { api } from "@/lib/transit.server";

type Params = { params: Promise<{ stationId: string }> };

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: Params) {
  const { stationId } = await params;
  const station = api.stations.find((s) => s.id === stationId);
  if (!station) {
    return NextResponse.json({ error: "station_not_found" }, { status: 404 });
  }

  const arrivals = station.routes
    .map((routeId) => {
      const route = api.routes.find((r) => r.id === routeId);
      if (!route) return null;
      return {
        routeId,
        routeNumber: route.number,
        routeName: route.name,
        operator: route.operator,
        color: route.color,
        toward: route.to,
        etaMinutes: api.etaMinutes(stationId, routeId),
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => a.etaMinutes - b.etaMinutes);

  return NextResponse.json({ data: { ...station, arrivals } });
}
