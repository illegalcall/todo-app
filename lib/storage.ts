import type { Todo } from "@/types/todo";

export const STORAGE_KEY = "daybook.todos.v2";

function isPriority(value: unknown): value is Todo["priority"] {
  return value === "now" || value === "next" || value === "later";
}

function isTodo(value: unknown): value is Todo {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.completed === "boolean" &&
    isPriority(candidate.priority) &&
    typeof candidate.createdAt === "string" &&
    (candidate.dueTime === undefined || typeof candidate.dueTime === "string")
  );
}

/** Load todos from localStorage, or null when missing/invalid. */
export function loadTodos(): Todo[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isTodo)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Persist todos to localStorage. */
export function saveTodos(todos: Todo[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // Quota or private mode — fail silently.
  }
}
