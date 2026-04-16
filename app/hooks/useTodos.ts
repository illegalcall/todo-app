"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import type { FilterMode, Todo } from "../types";

const STORAGE_KEY = "todo-app-todos";

function parseTodos(data: string | null): Todo[] {
  if (!data) return [];
  try {
    const parsed: unknown = JSON.parse(data);
    return Array.isArray(parsed) ? (parsed as Todo[]) : [];
  } catch {
    return [];
  }
}

// Module-level store — singleton on the client, unused on the server
let todos: Todo[] = [];
let storeInitialized = false;
const listeners = new Set<() => void>();

function ensureInitialized(): void {
  if (storeInitialized || typeof window === "undefined") return;
  todos = parseTodos(localStorage.getItem(STORAGE_KEY));
  storeInitialized = true;
}

function persist(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // localStorage may be full or unavailable
  }
}

function emitChange(): void {
  persist();
  for (const listener of listeners) listener();
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): Todo[] {
  ensureInitialized();
  return todos;
}

function getServerSnapshot(): Todo[] {
  return [];
}

function addTodoToStore(text: string): void {
  const trimmed = text.trim();
  if (!trimmed) return;
  ensureInitialized();
  todos = [
    {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    },
    ...todos,
  ];
  emitChange();
}

function toggleTodoInStore(id: string): void {
  ensureInitialized();
  todos = todos.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t,
  );
  emitChange();
}

function deleteTodoFromStore(id: string): void {
  ensureInitialized();
  todos = todos.filter((t) => t.id !== id);
  emitChange();
}

function editTodoInStore(id: string, text: string): void {
  const trimmed = text.trim();
  if (!trimmed) return;
  ensureInitialized();
  todos = todos.map((t) =>
    t.id === id ? { ...t, text: trimmed } : t,
  );
  emitChange();
}

function clearCompletedInStore(): void {
  ensureInitialized();
  todos = todos.filter((t) => !t.completed);
  emitChange();
}

export function useTodos() {
  const allTodos = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [filter, setFilter] = useState<FilterMode>("all");

  const addTodo = useCallback((text: string) => addTodoToStore(text), []);
  const toggleTodo = useCallback((id: string) => toggleTodoInStore(id), []);
  const deleteTodo = useCallback((id: string) => deleteTodoFromStore(id), []);
  const editTodo = useCallback(
    (id: string, text: string) => editTodoInStore(id, text),
    [],
  );
  const clearCompleted = useCallback(() => clearCompletedInStore(), []);

  const filteredTodos = allTodos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = allTodos.filter((todo) => !todo.completed).length;
  const completedCount = allTodos.filter((todo) => todo.completed).length;

  return {
    todos: filteredTodos,
    allTodos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    activeCount,
    completedCount,
    totalCount: allTodos.length,
  };
}
