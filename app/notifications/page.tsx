import type { Metadata } from "next";

import { NotificationsPage } from "@/components/pages/notifications";

export const metadata: Metadata = {
  title: "Notifications — Inzira Navix Transit",
  description: "Service alerts, incidents and bus arrival reminders for the Kigali transit network.",
  openGraph: {
    title: "Notifications — Inzira Navix Transit",
    description: "Alerts that keep you moving across the Kigali transit network.",
  },
};

export default function Page() {
  return <NotificationsPage />;
}
