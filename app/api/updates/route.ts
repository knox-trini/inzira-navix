import { NextResponse } from "next/server";

import { api } from "@/lib/transit.server";

export const dynamic = "force-dynamic";

export function GET() {
  const sorted = [...api.updates].sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
  );
  return NextResponse.json({ data: sorted, count: sorted.length });
}
