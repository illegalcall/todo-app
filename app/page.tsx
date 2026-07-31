"use client";

import { useEffect, useMemo, useState } from "react";
import AmbientBackground from "@/components/AmbientBackground";
import DayOrbit from "@/components/DayOrbit";
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";
import FilterTabs from "@/components/FilterTabs";
import FocusSession from "@/components/FocusSession";
import { getDayContext } from "@/lib/day";
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
  } = useTodos();

  const [now, setNow] = useState(() => new Date());
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const day = useMemo(() => getDayContext(now), [now]);
  const focusedTodo = todos.find((todo) => todo.id === focusedId) ?? null;

  function handleFocusComplete() {
    if (!focusedId) return;
    toggleTodo(focusedId);
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
            <button type="button" className="btn btn--ghost btn--sm" onClick={clearCompleted}>
              Clear done
            </button>
          )}
        </div>

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
            title={focusedTodo.title}
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
