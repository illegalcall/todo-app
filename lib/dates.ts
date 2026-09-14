// #286 — Local-calendar due dates
import type { Todo } from "@/types/todo";

/** Return a local calendar date instead of a UTC-shifted date or weekday string. */
export function localDateKey(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

/** A task becomes overdue the day after its due date, until completed. */
export function isOverdue(todo: Todo, today: string): boolean {
  return Boolean(
    today && !todo.completed && todo.dueDate && todo.dueDate < today,
  );
}

/** Refresh the date while a page remains open, including across midnight. */
export function subscribeDate(listener: () => void): () => void {
  const timer = setInterval(listener, 60_000);
  return () => clearInterval(timer);
}

/** Defer clock-dependent content until after hydration. */
export function serverDateSnapshot(): string {
  return "";
}
