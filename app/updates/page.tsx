import type { Metadata } from "next";

import { UpdatesPage } from "@/components/pages/updates";

export const metadata: Metadata = {
  title: "Transport Updates — Inzira Navix Transit",
  description: "Live delays, incidents and service changes for Kigali public transport.",
  openGraph: {
    title: "Transport Updates — Inzira Navix Transit",
    description: "Live delays, incidents and service changes for Kigali public transport.",
  },
};

export default function Page() {
  return <UpdatesPage />;
}
