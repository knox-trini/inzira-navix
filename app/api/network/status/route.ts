import { NextResponse } from "next/server";

import { getNetworkStatus } from "@/lib/transit.server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ data: getNetworkStatus() });
}
