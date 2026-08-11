import type { Metadata, Viewport } from "next";

import { Providers } from "@/components/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Inzira Navix Transit — Smart public transport for Kigali",
  description:
    "Real-time routes, stations, ETAs and live tracking for Kigali's public transport network.",
  authors: [{ name: "Inzira" }],
  openGraph: {
    title: "Inzira Navix Transit",
    description: "Smart public transport information for Kigali.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c8a7a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
