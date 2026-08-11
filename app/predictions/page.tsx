import type { Metadata } from "next";

import { PredictionsPage } from "@/components/pages/predictions";

export const metadata: Metadata = {
  title: "Traffic Predictions — Inzira Navix Transit",
  description: "Hour-by-hour AI traffic predictions across the Kigali transit network.",
  openGraph: {
    title: "Traffic Predictions — Inzira Navix Transit",
    description: "AI congestion forecasts for every route in the Kigali transit network.",
  },
};

export default function Page() {
  return <PredictionsPage />;
}
