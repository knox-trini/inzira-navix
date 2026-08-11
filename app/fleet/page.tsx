import type { Metadata } from "next";

import { FleetPage } from "@/components/pages/fleet";

export const metadata: Metadata = {
  title: "Fleet — Inzira Navix Transit",
  description: "Live fleet management for the Kigali transit network.",
  openGraph: {
    title: "Fleet — Inzira Navix Transit",
    description: "Every bus, driver and maintenance status across the Kigali fleet.",
  },
};

export default function Page() {
  return <FleetPage />;
}
