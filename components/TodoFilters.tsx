// #273 — filter tabs (All / Active / Completed)
"use client";

import { useRef } from "react";
import type { TodoFilter } from "@/types/todo";

const FILTERS: { value: TodoFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

/** Id of the tab that selects `filter`, so the panel can point back at it. */
export function filterTabId(filter: TodoFilter) {
  return `todo-filter-${filter}`;
}

interface TodoFiltersProps {
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  counts: Record<TodoFilter, number>;
  /** Id of the tabpanel these tabs control. */
  panelId: string;
}

export default function TodoFilters({
  filter,
  onFilterChange,
  counts,
  panelId,
}: TodoFiltersProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Automatic activation: moving focus also selects, per the ARIA tabs pattern.
  function selectTabAt(index: number) {
    const next = (index + FILTERS.length) % FILTERS.length;
    onFilterChange(FILTERS[next].value);
    tabRefs.current[next]?.focus();
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    switch (event.key) {
      case "ArrowLeft":
        selectTabAt(index - 1);
        break;
      case "ArrowRight":
        selectTabAt(index + 1);
        break;
      case "Home":
        selectTabAt(0);
        break;
      case "End":
        selectTabAt(FILTERS.length - 1);
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  return (
    <div
      role="tablist"
      aria-label="Filter todos"
      className="flex gap-1 rounded-md border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800"
    >
      {FILTERS.map((option, index) => {
        const selected = option.value === filter;
        const count = counts[option.value];

        return (
          <button
            key={option.value}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={filterTabId(option.value)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            onClick={() => onFilterChange(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              selected
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            {option.label}
            <span
              aria-hidden="true"
              className={`rounded-full px-1.5 text-xs tabular-nums ${
                selected
                  ? "bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-200"
                  : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              {count}
            </span>
            <span className="sr-only">
              {count === 1 ? "(1 todo)" : `(${count} todos)`}
            </span>
          </button>
        );
      })}
    </div>
  );
}
