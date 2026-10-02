// #264/#274 — localStorage persistence helpers
// #275/#265 — due date aware hydration
import type { Todo } from "@/types/todo";
import { sampleTodos } from "@/types/todo";

// Versioned key: bump STORAGE_VERSION when the persisted shape changes so
// stale/incompatible data is ignored instead of breaking hydration.
const STORAGE_VERSION = 1;
const STORAGE_KEY = `daybook.todos.v${STORAGE_VERSION}`;

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

/**
 * Access `window.localStorage` safely. Merely reading the property can throw
 * (e.g. some privacy modes or embedded webviews block storage entirely).
 */
function safeLocalStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Load todos from localStorage; falls back to sample data. */
export function loadTodos(): Todo[] {
  const storage = safeLocalStorage();
  if (!storage) return sampleTodos;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return sampleTodos;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return sampleTodos;
    // Keep individually valid entries so one bad item can't wipe the list.
    const todos = parsed.filter(isValidTodo);
    if (todos.length === 0) return sampleTodos;
    return todos;
  } catch {
    // Corrupted JSON or an inaccessible store; fall back to sample data.
    return sampleTodos;
  }
}

/** Persist todos to localStorage (no-op during SSR or when unavailable). */
export function saveTodos(todos: Todo[]): void {
  const storage = safeLocalStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // Storage full or unavailable; persistence is best-effort.
  }
}
