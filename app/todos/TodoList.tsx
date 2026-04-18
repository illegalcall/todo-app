"use client";

import { useMemo, useState } from "react";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
};

function formatDueDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function isOverdue(iso: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${iso}T00:00:00`);
  return due.getTime() < today.getTime();
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const sorted = useMemo(() => {
    return [...todos].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });
  }, [todos]);

  function addTodo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: trimmed,
        completed: false,
        dueDate: dueDate || null,
      },
    ]);
    setTitle("");
    setDueDate("");
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  return (
    <div className="w-full max-w-xl">
      <form
        onSubmit={addTodo}
        className="flex flex-col gap-2 sm:flex-row sm:items-end mb-6"
      >
        <label className="flex-1 flex flex-col text-sm text-gray-700">
          <span className="mb-1 font-medium">Task</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What needs to be done?"
            className="rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-900 focus:outline-none"
            required
          />
        </label>
        <label className="flex flex-col text-sm text-gray-700">
          <span className="mb-1 font-medium">Due date</span>
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-900 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
        >
          Add
        </button>
      </form>

      {sorted.length === 0 ? (
        <p className="text-gray-500">No todos yet. Add one above.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {sorted.map((todo) => {
            const overdue =
              !todo.completed && todo.dueDate !== null && isOverdue(todo.dueDate);
            return (
              <li
                key={todo.id}
                className="flex items-center gap-3 rounded border border-gray-200 bg-white px-3 py-2"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  aria-label={`Mark ${todo.title} as ${
                    todo.completed ? "incomplete" : "complete"
                  }`}
                  className="h-4 w-4"
                />
                <div className="flex-1">
                  <p
                    className={
                      todo.completed
                        ? "text-gray-400 line-through"
                        : "text-gray-900"
                    }
                  >
                    {todo.title}
                  </p>
                  {todo.dueDate && (
                    <p
                      className={`text-xs ${
                        overdue ? "text-red-600" : "text-gray-500"
                      }`}
                    >
                      Due {formatDueDate(todo.dueDate)}
                      {overdue ? " (overdue)" : ""}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label={`Delete ${todo.title}`}
                  className="text-sm text-gray-500 hover:text-red-600"
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
