// #273 — Filter tabs for todo list (All / Active / Completed)
import type { Filter } from "@/types/filter";

interface FilterTabsProps {
  filter: Filter;
  onChange: (filter: Filter) => void;
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export default function FilterTabs({ filter, onChange }: FilterTabsProps) {
  return (
    <div className="mb-4 flex gap-2">
      {FILTERS.map(({ value, label }) => {
        const isActive = filter === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(value)}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isActive
                ? "bg-blue-600 text-white dark:bg-blue-500"
                : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
