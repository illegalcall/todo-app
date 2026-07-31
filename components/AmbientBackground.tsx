"use client";

import type { DayPhase } from "@/lib/day";

interface AmbientBackgroundProps {
  phase: DayPhase;
}

/** Soft horizon atmosphere that shifts with the day phase. */
export default function AmbientBackground({ phase }: AmbientBackgroundProps) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className={`ambient-wash ambient-wash--${phase}`} />
      <div className="ambient-orb ambient-orb--sun" />
      <div className="ambient-orb ambient-orb--sea" />
      <svg className="ambient-waves" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
          className="ambient-wave ambient-wave--a"
          d="M0,224 C240,280 480,120 720,176 C960,232 1200,288 1440,208 L1440,320 L0,320 Z"
        />
        <path
          className="ambient-wave ambient-wave--b"
          d="M0,256 C320,200 560,300 800,244 C1040,188 1240,160 1440,220 L1440,320 L0,320 Z"
        />
      </svg>
      <div className="ambient-grain" />
    </div>
  );
}
