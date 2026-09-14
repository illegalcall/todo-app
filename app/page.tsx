// #107 — Main page wiring with state management
// #108 — Todo deletion  |  #109 — Todo count summary
"use client";

import { useRef, useState } from "react";
import type { Todo } from "@/types/todo";
import { sampleTodos } from "@/types/todo";
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(sampleTodos);
  const [query, setQuery] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);
  const search = query.trim().toLowerCase();
  const visibleTodos = todos.filter((todo) => todo.title.toLowerCase().includes(search));

  function handleAdd(title: string) {
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, completed: false },
    ]);
  }

  function handleToggle(id: string) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  function handleDelete(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  // #109 — count summary
  const activeCount = todos.filter((todo) => !todo.completed).length;

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
        <label htmlFor="todo-search" className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
          Search todos
        </label>
        <div className="flex gap-2">
          <input
            id="todo-search"
            ref={searchInput}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title"
            className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
          {query && <button type="button" onClick={() => { setQuery(""); searchInput.current?.focus(); }} className="rounded-md px-3 py-2 text-sm text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-blue-400">Clear search</button>}
        </div>
        <p aria-live="polite" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {visibleTodos.length} of {todos.length} todos shown
        </p>
      </div>

      <TodoList
        todos={visibleTodos}
        onToggle={handleToggle}
        onDelete={handleDelete}
        emptyMessage={todos.length > 0 && search ? "No matching todos. Clear or change your search." : undefined}
      />

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
    </main>
  );
}
