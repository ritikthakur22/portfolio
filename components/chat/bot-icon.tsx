"use client";

import { forwardRef } from "react";

/** Teal chat bubble with two eyes. Pupils and lids are positioned by the parent via refs. */
export const BotIcon = forwardRef<SVGSVGElement, { pupils: React.Ref<SVGGElement>; lids: React.Ref<SVGGElement>; hand?: React.Ref<SVGPathElement> }>(
  function BotIcon({ pupils, lids, hand }, ref) {
    return (
      <svg ref={ref} viewBox="0 0 64 64" aria-hidden className="size-full overflow-visible drop-shadow-[0_10px_24px_rgb(0_0_0/0.35)]">
        <path
          className="fill-accent"
          d="M32 4C16.5 4 4 15.6 4 30c0 7.4 3.3 14 8.6 18.8L10 60l12.4-6.2c3 1 6.3 1.6 9.6 1.6 15.5 0 28-11.6 28-26S47.5 4 32 4z"
        />
        <path ref={hand} className="fill-accent" style={{ transformOrigin: "56px 44px", opacity: 0 }} d="M56 44c5-1 9-6 8-10-1-3-4-3-5 0l-3 6z" />
        <g ref={lids} style={{ transformOrigin: "32px 29px", transformBox: "view-box" }}>
          <ellipse cx="23" cy="29" rx="7" ry="8" fill="var(--bg)" />
          <ellipse cx="41" cy="29" rx="7" ry="8" fill="var(--bg)" />
          <g ref={pupils}>
            <circle className="fill-accent" cx="23" cy="29" r="3.4" />
            <circle className="fill-accent" cx="41" cy="29" r="3.4" />
          </g>
        </g>
      </svg>
    );
  },
);
