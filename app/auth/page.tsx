import type { Metadata } from "next";

import { AuthPage } from "@/components/pages/auth";

export const metadata: Metadata = {
  title: "Sign in or create account — Inzira Navix Transit",
  description:
    "Sign in or create your free Inzira Navix Transit account to save trips and get personalized alerts.",
  openGraph: {
    title: "Sign in — Inzira Navix Transit",
    description: "Create your free Inzira Navix Transit account.",
  },
};

export default function Page() {
  return <AuthPage />;
}
