"use client";

import { useEffect, useRef, useState } from "react";
import { formatCountdown, remainingFocusMs } from "@/lib/day";

const FOCUS_SECONDS = 25 * 60;

interface FocusSessionProps {
  title: string;
  onComplete: () => void;
  onExit: () => void;
  saveError?: boolean;
}

/** Deep-work timer for a single orbiting task. */
export default function FocusSession({
  title,
  onComplete,
  onExit,
  saveError,
}: FocusSessionProps) {
  const [remaining, setRemaining] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(true);
  const completedRef = useRef(false);
  const remainingMs = useRef(FOCUS_SECONDS * 1000);
  const deadline = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  useEffect(() => {
    if (!running) return;
    deadline.current = Date.now() + remainingMs.current;
    const tick = () => {
      remainingMs.current = remainingFocusMs(deadline.current, Date.now());
      setRemaining(Math.ceil(remainingMs.current / 1000));
      if (remainingMs.current === 0 && !completedRef.current) {
        completedRef.current = true;
        setRunning(false);
        onCompleteRef.current();
      }
    };
    const id = window.setInterval(tick, 250);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [running]);

  function toggleRunning() {
    if (running) {
      remainingMs.current = remainingFocusMs(deadline.current, Date.now());
      setRemaining(Math.ceil(remainingMs.current / 1000));
      if (remainingMs.current === 0 && !completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current();
      }
    }
    setRunning((previous) => !previous);
  }

  function exitFocus() {
    // Close while still connected so the browser restores the launching control.
    dialogRef.current?.close();
    onExit();
  }

  const progress = 1 - remaining / FOCUS_SECONDS;
  const size = 180;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <dialog
      ref={dialogRef}
      className="focus-panel"
      aria-labelledby="focus-title"
      onCancel={(event) => {
        event.preventDefault();
        exitFocus();
      }}
    >
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

      {saveError && (
        <p role="alert">
          Could not save this task. Check browser storage and try again.
        </p>
      )}
      <div className="focus-panel__actions">
        {remaining === 0 && (
          <button
            type="button"
            className="btn btn--primary"
            onClick={onComplete}
          >
            Mark task done
          </button>
        )}
        <button
          type="button"
          className="btn btn--ghost"
          onClick={toggleRunning}
          disabled={remaining === 0}
        >
          {running ? "Pause" : "Resume"}
        </button>
        <button type="button" className="btn btn--primary" onClick={exitFocus}>
          Leave focus
        </button>
      </div>
    </dialog>
  );
}
