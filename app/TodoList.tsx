"use client";

import { useState, type FormEvent } from "react";
import type { Todo } from "./types";
import { useLocalStorage } from "./useLocalStorage";

const STORAGE_KEY = "todo-app:todos";

export function TodoList() {
  const [todos, setTodos, hydrated] = useLocalStorage<Todo[]>(STORAGE_KEY, []);
  const [input, setInput] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    const newTodo: Todo = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
    setInput("");
  }

  function toggle(id: string) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  function remove(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }

  const remaining = todos.filter((t) => !t.completed).length;
  const hasCompleted = todos.some((t) => t.completed);

  return (
    <section className="w-full max-w-xl">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
          aria-label="New todo"
          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700"
        >
          Add
        </button>
      </form>

      {!hydrated ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : todos.length === 0 ? (
        <p className="text-gray-500">No todos yet. Add one above.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-200"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggle(todo.id)}
                  aria-label={`Mark "${todo.text}" as ${todo.completed ? "incomplete" : "complete"}`}
                  className="h-4 w-4"
                />
                <span
                  className={`flex-1 ${todo.completed ? "line-through text-gray-400" : "text-gray-900"}`}
                >
                  {todo.text}
                </span>
                <button
                  type="button"
                  onClick={() => remove(todo.id)}
                  aria-label={`Delete "${todo.text}"`}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <span>
              {remaining} {remaining === 1 ? "item" : "items"} left
            </span>
            {hasCompleted && (
              <button
                type="button"
                onClick={clearCompleted}
                className="text-blue-600 hover:text-blue-800"
              >
                Clear completed
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
