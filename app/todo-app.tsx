"use client";

import {
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

const STORAGE_KEY = "todo-app:todos:v1";

function isTodo(value: unknown): value is Todo {
  if (value === null || typeof value !== "object") return false;
  return (
    "id" in value &&
    typeof (value as { id: unknown }).id === "string" &&
    "text" in value &&
    typeof (value as { text: unknown }).text === "string" &&
    "completed" in value &&
    typeof (value as { completed: unknown }).completed === "boolean"
  );
}

function parseTodos(raw: string | null): Todo[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isTodo);
  } catch {
    return [];
  }
}

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function getSnapshot(): string {
  return safeGetItem(STORAGE_KEY) ?? "";
}

function getServerSnapshot(): string {
  return "";
}

// Tracks "is this render after client mount?" so we can avoid rendering
// a misleading empty state on the SSR/hydration pass before localStorage
// has been read.
function subscribeMount(): () => void {
  return () => {};
}

function getMountedSnapshot(): boolean {
  return true;
}

function getMountedServerSnapshot(): boolean {
  return false;
}

function writeTodos(todos: Todo[]): boolean {
  if (!safeSetItem(STORAGE_KEY, JSON.stringify(todos))) return false;
  notifyListeners();
  return true;
}

export default function TodoApp() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const mounted = useSyncExternalStore(
    subscribeMount,
    getMountedSnapshot,
    getMountedServerSnapshot,
  );
  const todos = useMemo(() => parseTodos(snapshot), [snapshot]);
  const [input, setInput] = useState("");

  // Reads current todos directly from storage so mutations never compute
  // from a stale snapshot (e.g., before the first post-hydration read).
  // Returns false when the write fails so callers can preserve user input.
  const setTodos = useCallback(
    (updater: (prev: Todo[]) => Todo[]): boolean => {
      const current = parseTodos(safeGetItem(STORAGE_KEY));
      return writeTodos(updater(current));
    },
    [],
  );

  const completedCount = todos.filter((t) => t.completed).length;
  const remainingCount = todos.length - completedCount;

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const saved = setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, completed: false },
    ]);
    if (saved) setInput("");
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
    <>
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

      {!mounted ? (
        <p className="text-sm text-gray-400" role="status" aria-live="polite">
          Loading…
        </p>
      ) : todos.length === 0 ? (
        <p className="text-gray-500">No todos yet. Add one above.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center gap-3 px-3 py-2">
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
              {remainingCount} item{remainingCount === 1 ? "" : "s"} left
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
    </>
  );
}
