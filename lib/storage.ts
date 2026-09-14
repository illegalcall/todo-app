// #112 — SSR-safe localStorage persistence helpers
import type { Todo } from "@/types/todo";
import { sampleTodos } from "@/types/todo";

const STORAGE_KEY = "daybook.todos";
const listeners = new Set<() => void>();

function isTodo(value: unknown): value is Todo {
  if (value === null || typeof value !== "object") return false;
  return (
    "id" in value &&
    typeof value.id === "string" &&
    "title" in value &&
    typeof value.title === "string" &&
    "completed" in value &&
    typeof value.completed === "boolean"
  );
}

/** Decode saved todos defensively; a saved empty list stays empty. */
export function parseTodos(raw: string | null): Todo[] {
  if (raw === null) return sampleTodos;
  try {
    const parsed: unknown = JSON.parse(raw);
    const value: unknown = Array.isArray(parsed) ? parsed.map(item => item && typeof item === "object" && !("title" in item) && "text" in item ? { ...item, title: item.text } : item) : parsed;
    if (
      Array.isArray(value) &&
      value.every(isTodo) &&
      new Set(value.map((todo) => todo.id)).size === value.length
    )
      return value;
  } catch {
    /* Corrupt storage must not prevent the app from mounting. */
  }
  return sampleTodos;
}

/** Read a stable snapshot without requiring browser storage during SSR. */
export function readTodosSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem("todo-app-todos");
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
    if (event.key === STORAGE_KEY || event.key === "todo-app-todos" || event.key === null) listener();
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
  if (typeof window === "undefined" || !todos.every(isTodo) ||
      new Set(todos.map(todo => todo.id)).size !== todos.length) return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    return false;
  }
  listeners.forEach((listener) => listener());
  return true;
}
