"use client";

import { useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState("");

  function addTodo() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos((prev) => [...prev, trimmed]);
    setInput("");
  }

  return (
    <main className="min-h-screen bg-white p-8 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Todo List</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add a new todo..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <button
          onClick={addTodo}
          className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
        >
          Add
        </button>
      </div>

      {todos.length === 0 ? (
        <p className="text-gray-500 text-sm">No todos yet. Add one above!</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo, i) => (
            <li key={i} className="border border-gray-200 rounded px-3 py-2 text-sm text-gray-800">
              {todo}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
