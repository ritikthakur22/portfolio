import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} | Portfolio`,
    short_name: "Ritik Thakur",
    description: profile.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#0b0d0e",
    theme_color: "#0b0d0e",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
