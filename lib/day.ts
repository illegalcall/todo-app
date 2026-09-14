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
  const hourProgress = Math.min(
    1,
    Math.max(0, (hour * 60 + minutes) / (24 * 60)),
  );

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

/** Stable minute snapshot for the client clock; the server uses a neutral view. */
export function clockSnapshot(): number {
  return Math.floor(Date.now() / 60_000) * 60_000;
}

/** Keep the initial server and client output identical during hydration. */
export function serverClockSnapshot(): number {
  return 0;
}

/** Catch up after background throttling as well as during a visible minute tick. */
export function subscribeClock(listener: () => void): () => void {
  const timer = window.setInterval(listener, 60_000);
  document.addEventListener("visibilitychange", listener);
  return () => {
    window.clearInterval(timer);
    document.removeEventListener("visibilitychange", listener);
  };
}

/** Measure remaining wall-clock time, even if interval callbacks were delayed. */
export function remainingFocusMs(deadline: number, now: number): number {
  return Math.max(0, deadline - now);
}
