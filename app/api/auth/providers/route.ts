import { NextResponse } from "next/server";
import { isProviderConfigured } from "@/lib/auth";

export async function GET() {
  const providers = ["google", "linkedin", "slack", "instagram", "whatsapp"];
  const config: Record<string, boolean> = {};

  for (const p of providers) {
    config[p] = isProviderConfigured(p);
  }

  return NextResponse.json(config);
}
