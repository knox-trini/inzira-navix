import type { Metadata } from "next";

import { LegalPage } from "@/components/pages/legal";

export const metadata: Metadata = {
  title: "Terms of Use — Inzira Navix Transit",
  description: "The terms governing your use of the Inzira Navix Transit app and website.",
};

const sections = [
  {
    heading: "Acceptance of terms",
    body: [
      "By accessing or using Inzira Navix Transit you agree to be bound by these terms. If you do not agree, please do not use the service.",
    ],
  },
  {
    heading: "The service",
    body: [
      "Inzira Navix Transit provides real-time route information, trip planning and transit analytics for Kigali during a limited pilot programme.",
      "Timing and route information is provided in good faith but may change without notice, and we do not guarantee it will always be accurate or available.",
    ],
  },
  {
    heading: "Acceptable use",
    body: [
      "You agree not to misuse the service — including attempting to gain unauthorised access, disrupting the service, or using it for any unlawful purpose.",
      "Your account is yours alone, and you are responsible for keeping your credentials secure.",
    ],
  },
  {
    heading: "Changes",
    body: [
      "We may update these terms from time to time. Continued use of the service after changes means you accept the updated terms.",
    ],
  },
  {
    heading: "Contact",
    body: ["Questions about these terms can be sent to hello@inzira.app."],
  },
];

export default function Page() {
  return <LegalPage title="Terms of Use" updated="Updated August 2026" sections={sections} />;
}
