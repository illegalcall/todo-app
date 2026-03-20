"use client";

import { useState, useRef, useEffect } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Buy groceries", completed: false },
    { id: 2, text: "Walk the dog", completed: true },
  ]);
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId !== null) {
      editInputRef.current?.focus();
    }
  }, [editingId]);

  function addTodo() {
    const trimmed = newText.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, completed: false },
    ]);
    setNewText("");
  }

  function toggleTodo(id: number) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTodo(id: number) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function startEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditText(todo.text);
  }

  function commitEdit(id: number) {
    const trimmed = editText.trim();
    if (trimmed) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
      );
    }
    setEditingId(null);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Todo List</h1>

      {/* Add todo */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="New todo..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </div>

      {/* Todo list */}
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-2 p-3 border border-gray-200 rounded group"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="w-4 h-4 accent-blue-600 shrink-0"
            />

            {editingId === todo.id ? (
              <input
                ref={editInputRef}
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitEdit(todo.id);
                  if (e.key === "Escape") cancelEdit();
                }}
                onBlur={() => commitEdit(todo.id)}
                className="flex-1 border border-blue-500 rounded px-2 py-0.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <span
                className={`flex-1 text-sm cursor-pointer ${
                  todo.completed ? "line-through text-gray-400" : "text-gray-900"
                }`}
                onDoubleClick={() => startEdit(todo)}
                title="Double-click to edit"
              >
                {todo.text}
              </span>
            )}

            {editingId === todo.id ? (
              <button
                onClick={cancelEdit}
                className="text-xs text-gray-500 hover:text-gray-700 shrink-0"
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={() => startEdit(todo)}
                className="text-xs text-gray-400 hover:text-blue-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Edit todo"
              >
                Edit
              </button>
            )}

            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-xs text-gray-400 hover:text-red-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Delete todo"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p className="text-gray-400 text-sm mt-4">No todos yet. Add one above.</p>
      )}
    </main>
  );
}
