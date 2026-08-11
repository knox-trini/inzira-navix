import type { Metadata } from "next";

import { AnalyticsPage } from "@/components/pages/analytics";

export const metadata: Metadata = {
  title: "Analytics — Inzira Navix Transit",
  description: "Network ridership, reliability and operator analytics for the Kigali transit network.",
  openGraph: {
    title: "Analytics — Inzira Navix Transit",
    description: "Ridership and on-time performance across the Kigali transit network.",
  },
};

export default function Page() {
  return <AnalyticsPage />;
}
