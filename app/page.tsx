"use client";

import { useState } from "react";

type Priority = "low" | "medium" | "high";

interface Todo {
  id: number;
  text: string;
  priority: Priority;
  completed: boolean;
}

const PRIORITY_STYLES: Record<Priority, { badge: string; border: string; label: string }> = {
  low: {
    badge: "bg-green-100 text-green-700",
    border: "border-l-4 border-green-400",
    label: "Low",
  },
  medium: {
    badge: "bg-yellow-100 text-yellow-700",
    border: "border-l-4 border-yellow-400",
    label: "Medium",
  },
  high: {
    badge: "bg-red-100 text-red-700",
    border: "border-l-4 border-red-400",
    label: "High",
  },
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [nextId, setNextId] = useState(1);

  function addTodo() {
    if (!text.trim()) return;
    setTodos([...todos, { id: nextId, text: text.trim(), priority, completed: false }]);
    setNextId(nextId + 1);
    setText("");
  }

  function toggleTodo(id: number) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function deleteTodo(id: number) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  return (
    <main className="min-h-screen bg-white p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Todo List</h1>

      {/* Add todo form */}
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add a new task..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          onClick={addTodo}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          Add
        </button>
      </div>

      {/* Todo list */}
      {todos.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No todos yet. Add one above!</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => {
            const styles = PRIORITY_STYLES[todo.priority];
            return (
              <li
                key={todo.id}
                className={`flex items-center gap-3 p-3 rounded-lg bg-gray-50 ${styles.border}`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <span
                  className={`flex-1 text-gray-900 ${todo.completed ? "line-through text-gray-400" : ""}`}
                >
                  {todo.text}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles.badge}`}>
                  {styles.label}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-gray-400 hover:text-red-500 text-lg leading-none"
                  aria-label="Delete todo"
                >
                  ×
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
