"use client";

import { useMemo, useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type Filter = "all" | "active" | "completed";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Read the docs", completed: true },
    { id: 2, text: "Build the todo app", completed: false },
    { id: 3, text: "Ship it", completed: false },
  ]);
  const [filter, setFilter] = useState<Filter>("all");
  const [draft, setDraft] = useState("");

  const visibleTodos = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.completed);
    if (filter === "completed") return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  const counts = useMemo(
    () => ({
      all: todos.length,
      active: todos.filter((t) => !t.completed).length,
      completed: todos.filter((t) => t.completed).length,
    }),
    [todos],
  );

  function toggleTodo(id: number) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }

  function addTodo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text, completed: false },
    ]);
    setDraft("");
  }

  return (
    <section className="w-full max-w-xl">
      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-gray-500"
          aria-label="New todo"
        />
        <button
          type="submit"
          className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
          disabled={!draft.trim()}
        >
          Add
        </button>
      </form>

      <div
        role="tablist"
        aria-label="Filter todos"
        className="flex gap-1 mb-4 border-b border-gray-200"
      >
        {FILTERS.map(({ value, label }) => {
          const active = filter === value;
          return (
            <button
              key={value}
              role="tab"
              aria-selected={active}
              aria-controls="todo-list"
              onClick={() => setFilter(value)}
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                active
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
              <span className="ml-1 text-xs text-gray-400">
                ({counts[value]})
              </span>
            </button>
          );
        })}
      </div>

      <ul
        id="todo-list"
        role="tabpanel"
        className="flex flex-col gap-2"
      >
        {visibleTodos.length === 0 ? (
          <li className="text-gray-500 text-sm py-4 text-center">
            No todos to show.
          </li>
        ) : (
          visibleTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 rounded border border-gray-200 px-3 py-2"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                aria-label={`Mark "${todo.text}" as ${
                  todo.completed ? "active" : "completed"
                }`}
                className="h-4 w-4"
              />
              <span
                className={
                  todo.completed
                    ? "text-gray-400 line-through"
                    : "text-gray-900"
                }
              >
                {todo.text}
              </span>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
