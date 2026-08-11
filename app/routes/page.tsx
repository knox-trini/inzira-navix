import type { Metadata } from "next";

import { RoutesListPage } from "@/components/pages/routes";

export const metadata: Metadata = {
  title: "Bus Routes — Inzira Navix Transit",
  description:
    "Browse every Kigali bus route with fares, frequency, operating hours and stops.",
  openGraph: {
    title: "Bus Routes — Inzira Navix Transit",
    description: "Browse every Kigali bus route with fares, frequency and stops.",
  },
};

export default function Page() {
  return <RoutesListPage />;
}
