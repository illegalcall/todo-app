// #273 — Filter tabs for the todo list (All / Active / Completed)

export type TodoFilter = "all" | "active" | "completed";

interface FilterTabsProps {
  filter: TodoFilter;
  onChange: (filter: TodoFilter) => void;
  counts: Record<TodoFilter, number>;
}

const FILTERS: { value: TodoFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export default function FilterTabs({ filter, onChange, counts }: FilterTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter todos"
      className="flex gap-1 rounded-md border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800"
    >
      {FILTERS.map(({ value, label }) => {
        const selected = filter === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(value)}
            className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              selected
                ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {label}
            <span className="ml-1.5 text-xs text-gray-400 dark:text-gray-500">
              {counts[value]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
