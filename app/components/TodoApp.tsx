"use client";

import { useState, useEffect, useRef } from "react";
import { Todo } from "@/app/types/todo";
import TodoItem from "./TodoItem";

const STORAGE_KEY = "todos";

function loadTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState("");
  const [inputDueDate, setInputDueDate] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTodos(loadTodos());
  }, []);

  function updateTodos(next: Todo[]) {
    setTodos(next);
    saveTodos(next);
  }

  function addTodo(e: React.FormEvent) {
    e.preventDefault();
    const text = inputText.trim();
    if (!text) return;
    const todo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      dueDate: inputDueDate || undefined,
      createdAt: new Date().toISOString(),
    };
    updateTodos([todo, ...todos]);
    setInputText("");
    setInputDueDate("");
    inputRef.current?.focus();
  }

  function toggleTodo(id: string) {
    updateTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function deleteTodo(id: string) {
    updateTodos(todos.filter((t) => t.id !== id));
  }

  function updateDueDate(id: string, dueDate: string | undefined) {
    updateTodos(todos.map((t) => (t.id === id ? { ...t, dueDate } : t)));
  }

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-foreground mb-8">Todo List</h1>

      {/* Add todo form */}
      <form onSubmit={addTodo} className="mb-6">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-2.5 rounded-lg border border-foreground/20 bg-background text-foreground placeholder:text-foreground/40 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 rounded-lg bg-foreground text-background text-sm font-medium disabled:opacity-30 hover:opacity-80 transition-opacity cursor-pointer disabled:cursor-default"
            >
              Add
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-foreground/50">Due date:</label>
            <input
              type="date"
              value={inputDueDate}
              onChange={(e) => setInputDueDate(e.target.value)}
              className="text-xs px-2 py-1 rounded border border-foreground/20 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-colors"
            />
            {inputDueDate && (
              <button
                type="button"
                onClick={() => setInputDueDate("")}
                className="text-xs text-foreground/30 hover:text-foreground/60 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Filter tabs */}
      {todos.length > 0 && (
        <div className="flex gap-1 mb-4">
          {(["all", "active", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-xs capitalize transition-colors cursor-pointer ${
                filter === f
                  ? "bg-foreground text-background"
                  : "text-foreground/50 hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto text-xs text-foreground/40 self-center">
            {activeCount} item{activeCount !== 1 ? "s" : ""} left
          </span>
        </div>
      )}

      {/* Todo list */}
      {filtered.length > 0 ? (
        <ul className="rounded-xl border border-foreground/10 bg-background px-4 divide-y-0">
          {filtered.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdateDueDate={updateDueDate}
            />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-foreground/40 text-center py-8">
          {filter === "all" ? "No todos yet. Add one above!" : `No ${filter} todos.`}
        </p>
      )}
    </div>
  );
}
