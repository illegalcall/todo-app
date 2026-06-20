"use client";

import { useState, type FormEvent } from "react";

type Todo = {
  id: string;
  text: string;
};

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  const handleAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text }]);
    setInput("");
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div className="mt-6 max-w-md">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Add a todo..."
          aria-label="New todo"
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
          disabled={!input.trim()}
        >
          Add
        </button>
      </form>

      {todos.length === 0 ? (
        <p className="mt-4 text-gray-500">No todos yet.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between rounded border border-gray-200 px-3 py-2"
            >
              <span className="text-gray-900">{todo.text}</span>
              <button
                type="button"
                onClick={() => handleDelete(todo.id)}
                aria-label={`Delete ${todo.text}`}
                className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
