// SSR-safe priority storage; accepts the old text-based records on first load.
import type { Todo } from "@/types/todo";
import { sampleTodos } from "@/types/todo";

const STORAGE_KEY = "daybook.todos";
const listeners = new Set<() => void>();

function decodeTodo(value: unknown): Todo | null {
  if (value === null || typeof value !== "object") return null;
  if (!("id" in value) || typeof value.id !== "string" ||
      !("completed" in value) || typeof value.completed !== "boolean") return null;
  const title = "title" in value ? value.title : "text" in value ? value.text : undefined;
  if (typeof title !== "string") return null;
  const priority = "priority" in value && (value.priority === "low" || value.priority === "high")
    ? value.priority : "medium";
  return { id: value.id, title, completed: value.completed, priority };
}

/** Decode saved todos defensively; a saved empty list stays empty. */
export function parseTodos(raw: string | null): Todo[] {
  if (raw === null) return sampleTodos;
  try {
    const value: unknown = JSON.parse(raw);
    if (Array.isArray(value)) {
      const decoded = value.map(decodeTodo);
      if (decoded.every((todo): todo is Todo => todo !== null) &&
          new Set(decoded.map((todo) => todo.id)).size === decoded.length) return decoded;
    }
  } catch {
    /* Corrupt storage must not prevent the app from mounting. */
  }
  return sampleTodos;
}

/** Read a stable snapshot without requiring browser storage during SSR. */
export function readTodosSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem("todos");
  } catch {
    return null;
  }
}

/** Match the server-rendered seed data on the first hydration pass. */
export function serverTodosSnapshot(): null {
  return null;
}

/** Subscribe to successful local writes and changes from other browser tabs. */
export function subscribeTodos(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === "todos" || event.key === null) listener();
  };
  if (typeof window !== "undefined")
    window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined")
      window.removeEventListener("storage", onStorage);
  };
}

/** Read the latest list so a mutation cannot overwrite a stale tab snapshot. */
export function loadTodos(): Todo[] {
  return parseTodos(readTodosSnapshot());
}

/** Persist a mutation and notify subscribers; false leaves user input intact. */
export function saveTodos(todos: Todo[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    return false;
  }
  listeners.forEach((listener) => listener());
  return true;
}
