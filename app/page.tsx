"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Buy groceries", completed: false },
    { id: 2, text: "Write blog post", completed: false },
    { id: 3, text: "Read a book", completed: true },
  ]);

  const incompleteCount = todos.filter((t) => !t.completed).length;

  useEffect(() => {
    document.title = `(${incompleteCount}) Todos`;
  }, [incompleteCount]);

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Todo List</h1>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span
              className={
                todo.completed ? "line-through text-gray-400" : "text-gray-900"
              }
            >
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
