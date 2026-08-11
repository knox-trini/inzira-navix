import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getRoute } from "@/data/kigali";
import { RouteDetailPage } from "@/components/pages/route-detail";

type Props = {
  params: Promise<{ routeId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { routeId } = await params;
  const route = getRoute(routeId);
  if (!route) {
    return { title: "Route not found — Inzira Navix Transit" };
  }
  return {
    title: `Route ${route.number} — ${route.name}`,
    description: `Stops, schedule and fare for Kigali route ${route.number}.`,
  };
}

export default async function Page({ params }: Props) {
  const { routeId } = await params;
  const route = getRoute(routeId);
  if (!route) notFound();
  return <RouteDetailPage route={route} />;
}
