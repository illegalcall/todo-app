"use client";

import { useState } from "react";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

const INITIAL_TODOS: Todo[] = [
  { id: "1", text: "Buy groceries", completed: false },
  { id: "2", text: "Read a book", completed: false },
  { id: "3", text: "Go for a walk", completed: true },
];

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS);

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  return (
    <ul className="mt-6 space-y-2">
      {todos.map((todo) => (
        <li key={todo.id}>
          <button
            onClick={() => toggleTodo(todo.id)}
            aria-pressed={todo.completed}
            className="flex w-full items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                todo.completed
                  ? "border-green-500 bg-green-500"
                  : "border-gray-400 bg-transparent"
              }`}
              aria-hidden="true"
            >
              {todo.completed && (
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </span>
            <span
              className={`text-sm transition-all ${
                todo.completed
                  ? "text-gray-400 line-through dark:text-gray-500"
                  : "text-gray-900 dark:text-gray-100"
              }`}
            >
              {todo.text}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
