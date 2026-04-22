"use client";

import { useState } from "react";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  const completedCount = todos.filter((t) => t.completed).length;

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, completed: false },
    ]);
    setInput("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Todo List</h1>

        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="New todo"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
            disabled={!input.trim()}
          >
            Add
          </button>
        </form>

        {todos.length === 0 ? (
          <p className="text-gray-500">No todos yet. Add one above.</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
              {todos.map((todo) => (
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
                  <span
                    className={`flex-1 text-gray-900 ${todo.completed ? "line-through text-gray-400" : ""}`}
                  >
                    {todo.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteTodo(todo.id)}
                    className="text-sm text-gray-500 hover:text-red-600"
                    aria-label={`Delete "${todo.text}"`}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>
                {todos.length - completedCount} item
                {todos.length - completedCount === 1 ? "" : "s"} left
              </span>
              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={clearCompleted}
                  className="rounded-md border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-100"
                >
                  Clear completed
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
