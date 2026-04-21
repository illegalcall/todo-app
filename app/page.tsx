"use client";

import { useState, type FormEvent } from "react";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [draft, setDraft] = useState("");

  const trimmedDraft = draft.trim();
  const canSubmit = trimmedDraft.length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: trimmedDraft,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [todo, ...prev]);
    setDraft("");
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

  const remaining = todos.filter((todo) => !todo.completed).length;

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Todo List</h1>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="What needs to be done?"
            aria-label="New todo"
            className="flex-1 rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded bg-gray-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Add
          </button>
        </form>

        {todos.length === 0 ? (
          <p className="text-gray-500">No todos yet. Add one above.</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 rounded border border-gray-200">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center gap-3 px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    aria-label={`Toggle ${todo.title}`}
                    className="h-4 w-4"
                  />
                  <span
                    className={`flex-1 text-gray-900 ${
                      todo.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {todo.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteTodo(todo.id)}
                    aria-label={`Delete ${todo.title}`}
                    className="text-sm text-gray-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-gray-500">
              {remaining} of {todos.length} remaining
            </p>
          </>
        )}
      </div>
    </main>
  );
}
