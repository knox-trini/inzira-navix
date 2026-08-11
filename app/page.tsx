import type { Metadata } from "next";

import { HomePage } from "@/components/pages/home";

export const metadata: Metadata = {
  title: "Inzira Navix Transit — Move smarter in Kigali",
  description:
    "Real-time bus routes, station finder, ETAs, live GPS tracking and trip planning for Kigali public transport. Inzira Navix Transit.",
  openGraph: {
    title: "Inzira Navix Transit — Move smarter in Kigali",
    description:
      "Smart public transport information for Kigali commuters — routes, stations, ETAs, updates, planner and live tracking.",
  },
};

export default function Page() {
  return <HomePage />;
}
