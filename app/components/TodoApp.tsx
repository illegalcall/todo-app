"use client";

import { useEffect } from "react";
import { useTodos } from "../hooks/useTodos";
import { TodoFilters } from "./TodoFilters";
import { TodoInput } from "./TodoInput";
import { TodoItem } from "./TodoItem";

export function TodoApp() {
  const {
    todos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    activeCount,
    completedCount,
    totalCount,
  } = useTodos();

  useEffect(() => {
    const suffix = totalCount > 0 ? ` (${activeCount})` : "";
    document.title = `Todo List${suffix}`;
  }, [activeCount, totalCount]);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Todo List
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Keep track of what you need to do
        </p>
      </header>

      <div className="space-y-6">
        <TodoInput onAdd={addTodo} />

        {totalCount > 0 && (
          <TodoFilters
            filter={filter}
            onFilterChange={setFilter}
            activeCount={activeCount}
            completedCount={completedCount}
            onClearCompleted={clearCompleted}
          />
        )}

        {todos.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            {totalCount === 0
              ? "No todos yet. Add one above!"
              : "No todos match this filter."}
          </div>
        ) : (
          <ul className="space-y-2" aria-label="Todo list">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
