"use client";

import { useState, useSyncExternalStore } from "react";
import AmbientBackground from "@/components/AmbientBackground";
import DayOrbit from "@/components/DayOrbit";
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";
import FilterTabs from "@/components/FilterTabs";
import FocusSession from "@/components/FocusSession";
import {
  clockSnapshot,
  getDayContext,
  serverClockSnapshot,
  subscribeClock,
} from "@/lib/day";
import { useTodos } from "@/hooks/useTodos";

export default function Home() {
  const {
    todos,
    visibleTodos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    activeCount,
    completedCount,
    progress,
    saveError,
  } = useTodos();

  const now = useSyncExternalStore(
    subscribeClock,
    clockSnapshot,
    serverClockSnapshot,
  );
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState(false);

  const day = now
    ? getDayContext(new Date(now))
    : {
        phase: "morning" as const,
        greeting: "Welcome",
        dateLabel: "Your day, one task at a time",
        hourProgress: 0,
      };
  const focusedTodo = todos.find((todo) => todo.id === focusedId) ?? null;

  function handleFocusComplete() {
    if (!focusedId) return;
    if (!updateTodo(focusedId, { completed: true })) return;
    setFocusedId(null);
    setCelebrate(true);
    window.setTimeout(() => setCelebrate(false), 2200);
  }

  return (
    <main className="shell">
      <AmbientBackground phase={day.phase} />

      <DayOrbit
        progress={progress}
        hourProgress={day.hourProgress}
        activeCount={activeCount}
        completedCount={completedCount}
        greeting={day.greeting}
        dateLabel={day.dateLabel}
      />

      <section className="workspace" aria-label="Tasks">
        <AddTodo onAdd={addTodo} />

        <div className="workspace__toolbar">
          <FilterTabs
            value={filter}
            onChange={setFilter}
            counts={{
              all: todos.length,
              active: activeCount,
              completed: completedCount,
            }}
          />
          {completedCount > 0 && (
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={clearCompleted}
            >
              Clear done
            </button>
          )}
        </div>

        {saveError && (
          <p role="alert">
            Could not save your changes. Check browser storage and try again.
          </p>
        )}

        <TodoList
          todos={visibleTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
          onFocus={setFocusedId}
          focusedId={focusedId}
        />

        <p className="hint" aria-live="polite">
          Double-click a task to rename · Focus starts a 25-minute orbit
        </p>
      </section>

      {focusedTodo && (
        <div className="focus-overlay">
          <FocusSession
            key={focusedTodo.id}
            title={focusedTodo.title}
            saveError={saveError}
            onComplete={handleFocusComplete}
            onExit={() => setFocusedId(null)}
          />
        </div>
      )}

      {celebrate && (
        <div className="celebrate" role="status">
          Orbit complete — task marked done
        </div>
      )}
    </main>
  );
}
