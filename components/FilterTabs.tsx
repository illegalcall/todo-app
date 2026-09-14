"use client";

import type { TodoFilter } from "@/types/todo";

interface FilterTabsProps {
  value: TodoFilter;
  onChange: (filter: TodoFilter) => void;
  counts: { all: number; active: number; completed: number };
}

const TABS: { id: TodoFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Open" },
  { id: "completed", label: "Done" },
];

export default function FilterTabs({ value, onChange, counts }: FilterTabsProps) {
  return (
    <div className="filters" role="tablist" aria-label="Filter todos">
      {TABS.map((tab) => {
        const selected = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            className={`filters__tab${selected ? " filters__tab--active" : ""}`}
            onClick={() => onChange(tab.id)}
          >
            <span>{tab.label}</span>
            <span className="filters__count">{counts[tab.id]}</span>
          </button>
        );
      })}
    </div>
  );
}
