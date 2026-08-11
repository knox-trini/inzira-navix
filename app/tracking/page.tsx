import type { Metadata } from "next";

import { TrackingPage } from "@/components/pages/tracking";

export const metadata: Metadata = {
  title: "Live Tracking — Inzira Navix Transit",
  description: "Watch Kigali buses move along their routes in real time.",
  openGraph: {
    title: "Live Tracking — Inzira Navix Transit",
    description: "Watch Kigali buses move along their routes in real time.",
  },
};

export default function Page() {
  return <TrackingPage />;
}
