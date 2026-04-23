"use client";

import { useMemo, useState } from "react";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  dueDate: string | null;
};

function formatDueDate(dueDate: string): string {
  const [year, month, day] = dueDate.split("-").map(Number);
  if (!year || !month || !day) return dueDate;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getTodayIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const today = useMemo(() => getTodayIso(), []);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: trimmed,
        completed: false,
        dueDate: dueDate || null,
      },
    ]);
    setText("");
    setDueDate("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      <form onSubmit={addTodo} className="flex flex-col gap-2 mb-6 sm:flex-row">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="New todo"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Due date (optional)"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
          disabled={!text.trim()}
        >
          Add
        </button>
      </form>

      {todos.length === 0 ? (
        <p className="text-gray-500">No todos yet. Add one above.</p>
      ) : (
        <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
          {todos.map((todo) => {
            const isOverdue =
              todo.dueDate !== null &&
              !todo.completed &&
              todo.dueDate < today;
            return (
              <li
                key={todo.id}
                className="flex items-center gap-3 px-3 py-2"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="h-4 w-4"
                  aria-label={`Mark "${todo.text}" as ${todo.completed ? "incomplete" : "complete"}`}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-gray-900 truncate ${todo.completed ? "line-through text-gray-400" : ""}`}
                  >
                    {todo.text}
                  </p>
                  {todo.dueDate !== null && (
                    <p
                      className={`text-xs ${isOverdue ? "text-red-600 font-medium" : "text-gray-500"}`}
                    >
                      Due {formatDueDate(todo.dueDate)}
                      {isOverdue ? " (overdue)" : ""}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => deleteTodo(todo.id)}
                  className="text-sm text-gray-500 hover:text-red-600"
                  aria-label={`Delete "${todo.text}"`}
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
