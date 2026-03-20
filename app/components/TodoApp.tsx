"use client";

import { useState } from "react";

type Filter = "all" | "active" | "done";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Done", value: "done" },
];

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Buy groceries", completed: false },
    { id: 2, text: "Walk the dog", completed: true },
    { id: 3, text: "Read a book", completed: false },
  ]);
  const [filter, setFilter] = useState<Filter>("all");

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "done") return todo.completed;
    return true;
  });

  function toggleTodo(id: number) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Todo List</h1>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-6">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className={[
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
              filter === value
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Todo list */}
      <ul className="space-y-2">
        {filteredTodos.length === 0 && (
          <li className="text-gray-400 text-sm py-4 text-center">
            No todos here.
          </li>
        )}
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-white"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="w-4 h-4 accent-gray-900 cursor-pointer"
            />
            <span
              className={
                todo.completed ? "line-through text-gray-400" : "text-gray-800"
              }
            >
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
