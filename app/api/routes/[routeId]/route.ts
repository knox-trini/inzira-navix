import { NextResponse } from "next/server";

import { api } from "@/lib/transit.server";

type Params = { params: Promise<{ routeId: string }> };

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: Params) {
  const { routeId } = await params;
  const route = api.routes.find((r) => r.id === routeId);
  if (!route) {
    return NextResponse.json({ error: "route_not_found" }, { status: 404 });
  }
  return NextResponse.json({ data: route });
}
