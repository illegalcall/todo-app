"use client";

import { useState } from "react";

interface Todo {
  id: number;
  text: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Buy groceries" },
    { id: 2, text: "Walk the dog" },
    { id: 3, text: "Read a book" },
  ]);

  function deleteTodo(id: number) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  return (
    <ul className="space-y-2 mt-4">
      {todos.length === 0 && (
        <li className="text-gray-400 text-sm">No todos yet.</li>
      )}
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
        >
          <span className="text-gray-800">{todo.text}</span>
          <button
            onClick={() => deleteTodo(todo.id)}
            aria-label={`Delete "${todo.text}"`}
            className="ml-4 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
