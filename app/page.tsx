// #107 — Main page wiring with state management
// #108 — Todo deletion  |  #109 — Todo count summary
"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { Todo, TodoFilter } from "@/types/todo";
import {
  loadTodos,
  parseTodos,
  readTodosSnapshot,
  saveTodos,
  serverTodosSnapshot,
  subscribeTodos,
} from "@/lib/storage";
import ClearCompleted from "@/components/ClearCompleted";
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";
import TodoFilters, { filterTabId } from "@/components/TodoFilters";

/** Render the persisted todo list and its date-aware summary. */
export default function Home() {
  const snapshot = useSyncExternalStore(
    subscribeTodos,
    readTodosSnapshot,
    serverTodosSnapshot,
  );
  const todos = useMemo(() => parseTodos(snapshot), [snapshot]);
  const failedEdits = useRef(new Set<string>());
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [saveError, setSaveError] = useState(false);

  function updateTodos(update: (previous: Todo[]) => Todo[]): boolean {
    const saved = saveTodos(update(loadTodos()));
    setSaveError(!saved);
    return saved;
  }

  function handleAdd(title: string): boolean {
    return updateTodos((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        title,
        completed: false,
      },
    ]);
  }

  function handleToggle(id: string) {
    if (failedEdits.current.has(id) && filter !== "all") return;
    const saved = updateTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
    if (saved && filter !== "all") document.getElementById(filterTabId(filter))?.focus();
  }

  function handleDelete(id: string) {
    if (updateTodos((prev) => prev.filter((todo) => todo.id !== id)) && failedEdits.current.has(id)) failedEdits.current.delete(id);
  }

  function handleRename(id: string, title: string): boolean {
    const saved = updateTodos(previous => previous.map(todo => todo.id === id ? { ...todo, title } : todo));
    if (saved) failedEdits.current.delete(id);
    else failedEdits.current.add(id);
    return saved;
  }

  // #109 — count summary
  const activeCount = todos.filter((todo) => !todo.completed).length;

  useEffect(() => {
    const visible = new Set(todos.filter(todo => filter === "all" ||
      (filter === "completed" ? todo.completed : !todo.completed)).map(todo => todo.id));
    for (const id of failedEdits.current) if (!visible.has(id)) failedEdits.current.delete(id);
  }, [todos, filter]);

  useEffect(() => { document.title = `(${activeCount}) Todos`; }, [activeCount]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Daybook
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Keep track of what needs doing today.
        </p>
      </header>

      <div className="mb-6">
        <AddTodo onAdd={handleAdd} />
      </div>



      <div className="mb-4">
        <TodoFilters filter={filter} onFilterChange={next => { if (failedEdits.current.size === 0) setFilter(next); }} panelId="todo-panel"
          counts={{ all: todos.length, active: activeCount, completed: todos.length - activeCount }} />
      </div>
      <div id="todo-panel" role="tabpanel" aria-labelledby={filterTabId(filter)} tabIndex={0}>
        <TodoList todos={todos.filter(todo => filter === "all" || (filter === "completed" ? todo.completed : !todo.completed))}
          onToggle={handleToggle} onDelete={handleDelete} onRename={handleRename} onCancelRename={id => { failedEdits.current.delete(id); }} />
      </div>

      {todos.some((todo) => todo.completed) && (
        <div className="mt-4">
          <ClearCompleted
            onClear={() => {
              const saved = updateTodos((previous) => previous.filter((todo) => !todo.completed));
              if (saved) {
                const remaining = new Set(loadTodos().map(todo => todo.id));
                for (const id of failedEdits.current) if (!remaining.has(id)) failedEdits.current.delete(id);
              }
            }}
          />
        </div>
      )}

      <p
        className="mt-6 text-sm text-gray-500 dark:text-gray-400"
        aria-live="polite"
      >
        {activeCount} active
        {todos.length > 0 && (
          <span className="text-gray-400 dark:text-gray-500">
            {" "}
            &middot; {todos.length} total
          </span>
        )}
      </p>
      {saveError && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          Could not save your changes. Check browser storage and try again.
        </p>
      )}
    </main>
  );
}
