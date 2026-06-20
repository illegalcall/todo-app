"use client";

import { useState } from "react";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  const addTodo = (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: trimmed,
        completed: false,
        createdAt: Date.now(),
      },
    ]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(input);
    setInput("");
  };

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Todo List</h1>

        <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            aria-label="New todo"
          />
          <button
            type="submit"
            disabled={input.trim().length === 0}
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Add
          </button>
        </form>

        {todos.length === 0 ? (
          <p className="text-gray-500">No todos yet. Add one above.</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center gap-3 rounded border border-gray-200 bg-gray-50 px-3 py-2"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  aria-label={`Mark "${todo.title}" as ${
                    todo.completed ? "incomplete" : "complete"
                  }`}
                  className="h-4 w-4"
                />
                <span
                  className={`flex-1 text-gray-900 ${
                    todo.completed ? "text-gray-400 line-through" : ""
                  }`}
                >
                  {todo.title}
                </span>
                <button
                  type="button"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label={`Delete "${todo.title}"`}
                  className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
