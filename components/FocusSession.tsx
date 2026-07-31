"use client";

import { useEffect, useRef, useState } from "react";
import { formatCountdown } from "@/lib/day";

const FOCUS_SECONDS = 25 * 60;

interface FocusSessionProps {
  title: string;
  onComplete: () => void;
  onExit: () => void;
}

/** Deep-work timer for a single orbiting task. */
export default function FocusSession({ title, onComplete, onExit }: FocusSessionProps) {
  const [remaining, setRemaining] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(true);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (remaining === 0 && !completedRef.current) {
      completedRef.current = true;
      setRunning(false);
      onComplete();
    }
  }, [remaining, onComplete]);

  const progress = 1 - remaining / FOCUS_SECONDS;
  const size = 180;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="focus-panel" role="dialog" aria-labelledby="focus-title">
      <div className="focus-panel__glow" aria-hidden="true" />
      <p className="focus-panel__eyebrow">Focus orbit</p>
      <h2 id="focus-title" className="focus-panel__title">
        {title}
      </h2>

      <div className="focus-panel__timer">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            className="focus-panel__track"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
          />
          <circle
            className="focus-panel__progress"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="focus-panel__countdown" aria-live="polite">
          {formatCountdown(remaining)}
        </div>
      </div>

      <div className="focus-panel__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setRunning((prev) => !prev)}
        >
          {running ? "Pause" : "Resume"}
        </button>
        <button type="button" className="btn btn--primary" onClick={onExit}>
          Leave focus
        </button>
      </div>
    </div>
  );
}
