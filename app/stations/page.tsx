import type { Metadata } from "next";

import { StationsPage } from "@/components/pages/stations";

export const metadata: Metadata = {
  title: "Nearby Stations — Inzira Navix Transit",
  description:
    "Find Kigali bus stations near you with walking distance, routes served, and next arrivals.",
  openGraph: {
    title: "Nearby Stations — Inzira Navix Transit",
    description: "Find Kigali bus stations near you with walking distance and live arrivals.",
  },
};

export default function Page() {
  return <StationsPage />;
}
