import { profile } from "@/content/profile";
import { ogCard, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = `${profile.name}, ${profile.title}`;

export default function Image() {
  return ogCard({ eyebrow: profile.availability, title: profile.name, subtitle: profile.title });
}
