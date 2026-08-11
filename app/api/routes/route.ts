import { NextResponse } from "next/server";

import { api } from "@/lib/transit.server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ data: api.routes, count: api.routes.length });
}
