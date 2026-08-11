import type { Metadata } from "next";

import { AboutPage } from "@/components/pages/about";

export const metadata: Metadata = {
  title: "About — Inzira Navix Transit",
  description:
    "The vision, mission and roadmap behind Inzira Navix Transit — smart mobility for African cities.",
  openGraph: {
    title: "About — Inzira Navix Transit",
    description: "Smart mobility for African cities — vision, mission, roadmap.",
  },
};

export default function Page() {
  return <AboutPage />;
}
