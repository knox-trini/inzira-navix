import { NextResponse } from "next/server";

import { getAnalytics } from "@/lib/transit.server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ data: getAnalytics() });
}
