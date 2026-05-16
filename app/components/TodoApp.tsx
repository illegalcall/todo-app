"use client";

import { useState, useCallback } from "react";
import type { Todo, Priority } from "../types/todo";
import TodoItem from "./TodoItem";

const STORAGE_KEY = "todos";

function persistTodos(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Todo[]) : [];
    } catch {
      return [];
    }
  });
  const [inputText, setInputText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const updateTodos = useCallback((fn: (prev: Todo[]) => Todo[]) => {
    setTodos((prev) => {
      const next = fn(prev);
      persistTodos(next);
      return next;
    });
  }, []);

  function addTodo() {
    const text = inputText.trim();
    if (!text) return;

    const todo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
    };

    updateTodos((prev) => [todo, ...prev]);
    setInputText("");
    setPriority("medium");
  }

  function toggleTodo(id: string) {
    updateTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTodo(id: string) {
    updateTodos((prev) => prev.filter((t) => t.id !== id));
  }

  const itemsLeft = todos.filter((t) => !t.completed).length;

  return (
    <div className="mx-auto w-full max-w-lg">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTodo();
        }}
        className="mb-6 flex gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          aria-label="Priority"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add
        </button>
      </form>

      {todos.length === 0 && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          No todos yet. Add one above!
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </ul>

      {todos.length > 0 && (
        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          {itemsLeft} {itemsLeft === 1 ? "item" : "items"} left
        </p>
      )}
    </div>
  );
}
