import type { Metadata } from "next";

import { LegalPage } from "@/components/pages/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — Inzira Navix Transit",
  description:
    "How Inzira Navix Transit collects, uses and protects your information during the pilot programme.",
};

const sections = [
  {
    heading: "Data we collect",
    body: [
      "When you create an account we store the name, email address and password hash you provide, along with any saved trips, tickets and preferences you add while using the app.",
      "We also collect basic, anonymous usage information — such as which routes and stations are viewed most — to help us improve the service.",
    ],
  },
  {
    heading: "How we use it",
    body: [
      "Your data is used solely to run the service: to keep you signed in, to remember your saved trips and tickets, and to send you service updates you have opted into.",
      "We never sell your personal data, and we never share it with third parties for advertising.",
    ],
  },
  {
    heading: "Storage & security",
    body: [
      "During the pilot, accounts are stored securely and access is protected by hashed passwords and secure session handling.",
      "You can delete your account and data at any time from the app, and we will erase your information promptly.",
    ],
  },
  {
    heading: "Contact",
    body: [
      "Questions about this policy or your data can be sent to hello@inzira.app and we will respond as quickly as we can.",
    ],
  },
];

export default function Page() {
  return <LegalPage title="Privacy Policy" updated="Updated August 2026" sections={sections} />;
}
