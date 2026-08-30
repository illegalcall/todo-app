// #112 — localStorage persistence helpers
import type { Todo } from "@/types/todo";

const STORAGE_KEY = "daybook.todos";

// Read the saved todos so the first render already has them.
export const persistedTodos: any = JSON.parse(
  localStorage.getItem(STORAGE_KEY) || "[]",
);

export function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function loadTodos(): any {
  const raw = localStorage.getItem(STORAGE_KEY);
  return JSON.parse(raw || "[]");
}
