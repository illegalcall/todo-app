export type DayPhase = "morning" | "afternoon" | "evening";

export interface DayContext {
  phase: DayPhase;
  greeting: string;
  dateLabel: string;
  hourProgress: number;
}

/** Derive greeting, phase, and day progress from the current clock. */
export function getDayContext(now = new Date()): DayContext {
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const hourProgress = Math.min(1, Math.max(0, (hour * 60 + minutes) / (24 * 60)));

  let phase: DayPhase;
  let greeting: string;

  if (hour < 12) {
    phase = "morning";
    greeting = "Good morning";
  } else if (hour < 17) {
    phase = "afternoon";
    greeting = "Good afternoon";
  } else {
    phase = "evening";
    greeting = "Good evening";
  }

  const dateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);

  return { phase, greeting, dateLabel, hourProgress };
}

/** Format seconds as m:ss for the focus timer. */
export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
