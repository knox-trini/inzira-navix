import { NextResponse } from "next/server";

import { api, getNetworkStatus } from "@/lib/transit.server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    data: api.predictions,
    network: getNetworkStatus(),
  });
}
