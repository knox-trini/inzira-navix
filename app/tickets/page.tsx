import type { Metadata } from "next";

import { TicketsPage } from "@/components/pages/tickets";

export const metadata: Metadata = {
  title: "Tickets — Inzira Navix Transit",
  description: "Buy single rides and passes for the Kigali transit network.",
  openGraph: {
    title: "Tickets — Inzira Navix Transit",
    description: "Digital tickets and passes for the Kigali transit network.",
  },
};

export default function Page() {
  return <TicketsPage />;
}
