import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Inzira Navix Transit",
    short_name: "Inzira",
    description: "Smart public transport information for Kigali — routes, stations, ETAs and live tracking.",
    start_url: "/",
    display: "standalone",
    background_color: "#04140d",
    theme_color: "#0c8a7a",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
