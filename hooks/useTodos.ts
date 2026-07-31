"use client";

import { useState, useSyncExternalStore } from "react";
import type { Priority, Todo, TodoFilter } from "@/types/todo";
import { PRIORITY_ORDER, sampleTodos } from "@/types/todo";
import { loadTodos, saveTodos } from "@/lib/storage";

let memoryTodos: Todo[] | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function getClientTodos(): Todo[] {
  if (memoryTodos) return memoryTodos;
  memoryTodos = loadTodos() ?? sampleTodos;
  return memoryTodos;
}

function getServerTodos(): Todo[] {
  return sampleTodos;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setStoreTodos(updater: (prev: Todo[]) => Todo[]) {
  memoryTodos = updater(getClientTodos());
  saveTodos(memoryTodos);
  emit();
}

export function useTodos() {
  const todos = useSyncExternalStore(subscribe, getClientTodos, getServerTodos);
  const [filter, setFilter] = useState<TodoFilter>("all");

  function addTodo(title: string, priority: Priority = "next", dueTime?: string) {
    setStoreTodos((prev) => [
      {
        id: crypto.randomUUID(),
        title,
        completed: false,
        priority,
        createdAt: new Date().toISOString(),
        dueTime,
      },
      ...prev,
    ]);
  }

  function toggleTodo(id: string) {
    setStoreTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  function deleteTodo(id: string) {
    setStoreTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  function updateTodo(
    id: string,
    patch: Partial<Pick<Todo, "title" | "priority" | "dueTime">>,
  ) {
    setStoreTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...patch } : todo)),
    );
  }

  function clearCompleted() {
    setStoreTodos((prev) => prev.filter((todo) => !todo.completed));
  }

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;
  const progress = todos.length === 0 ? 0 : completedCount / todos.length;

  const visibleTodos = todos
    .filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    })
    .slice()
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const byPriority = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (byPriority !== 0) return byPriority;
      return (a.dueTime ?? "99:99").localeCompare(b.dueTime ?? "99:99");
    });

  return {
    todos,
    visibleTodos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    activeCount,
    completedCount,
    progress,
  };
}
