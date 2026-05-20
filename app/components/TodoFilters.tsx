"use client";

import type { FilterMode } from "../types";

interface TodoFiltersProps {
  readonly filter: FilterMode;
  readonly onFilterChange: (filter: FilterMode) => void;
  readonly activeCount: number;
  readonly completedCount: number;
  readonly onClearCompleted: () => void;
}

const FILTERS: { readonly value: FilterMode; readonly label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export function TodoFilters({
  filter,
  onFilterChange,
  activeCount,
  completedCount,
  onClearCompleted,
}: TodoFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1" role="tablist" aria-label="Todo filters">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            role="tab"
            aria-selected={filter === value}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
              filter === value
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>
          {activeCount} {activeCount === 1 ? "item" : "items"} left
        </span>
        {completedCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="text-gray-400 transition-colors hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          >
            Clear completed
          </button>
        )}
      </div>
    </div>
  );
}
