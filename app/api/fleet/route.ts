import { NextResponse } from "next/server";

import { api } from "@/lib/transit.server";

export const dynamic = "force-dynamic";

export function GET() {
  const counts = {
    total: api.fleet.length,
    active: api.fleet.filter((b) => b.status === "active").length,
    idle: api.fleet.filter((b) => b.status === "idle").length,
    maintenance: api.fleet.filter((b) => b.status === "maintenance").length,
  };
  return NextResponse.json({ data: api.fleet, counts });
}
