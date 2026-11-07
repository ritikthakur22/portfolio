import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** Shared share-card layout in the site palette. */
export function ogCard({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0b0d0e", color: "#e8ecea" }}>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 800 }}>
          RT<span style={{ color: "#2dd4bf" }}>.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, color: "#8e9996" }}>{eyebrow}</div>
          <div style={{ fontSize: 112, fontWeight: 800, letterSpacing: -4, lineHeight: 1, marginTop: 12 }}>{title}</div>
          <div style={{ fontSize: 40, color: "#2dd4bf", marginTop: 20 }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#8e9996" }}>www.ritikthakur.com.np</div>
      </div>
    ),
    ogSize,
  );
}
