// #264/#274 — localStorage persistence helpers
// #275/#265 — due date aware hydration
import type { Todo } from "@/types/todo";
import { sampleTodos } from "@/types/todo";

const STORAGE_KEY = "daybook.todos";

function isValidTodo(value: unknown): value is Todo {
  if (typeof value !== "object" || value === null) return false;
  const todo = value as Record<string, unknown>;
  return (
    typeof todo.id === "string" &&
    typeof todo.title === "string" &&
    typeof todo.completed === "boolean" &&
    (todo.dueDate === undefined || typeof todo.dueDate === "string")
  );
}

/** Load todos from localStorage; falls back to sample data. */
export function loadTodos(): Todo[] {
  if (typeof window === "undefined") return sampleTodos;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return sampleTodos;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isValidTodo)) return sampleTodos;
    return parsed;
  } catch {
    return sampleTodos;
  }
}

/** Persist todos to localStorage (no-op during SSR). */
export function saveTodos(todos: Todo[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // Storage full or unavailable; persistence is best-effort.
  }
}
