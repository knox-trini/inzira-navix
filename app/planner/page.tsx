import type { Metadata } from "next";

import { PlannerPage } from "@/components/pages/planner";

export const metadata: Metadata = {
  title: "Trip Planner — Inzira Navix Transit",
  description:
    "Plan A→B trips across Kigali public transport with fare, transfers and total time.",
  openGraph: {
    title: "Trip Planner — Inzira Navix Transit",
    description: "Plan A→B trips across Kigali public transport with fare and transfers.",
  },
};

export default function Page() {
  return <PlannerPage />;
}
