import type { Metadata } from "next";

import { ContactPage } from "@/components/pages/contact";

export const metadata: Metadata = {
  title: "Contact — Inzira Navix Transit",
  description:
    "Get in touch with the Inzira Navix Transit team. Questions, feedback and partnership ideas welcome.",
};

export default function Page() {
  return <ContactPage />;
}
