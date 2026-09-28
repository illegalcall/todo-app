// #50 — Compact accessible progress display
import type { Todo } from "@/types/todo";

export default function TodoProgress({ todos }: { todos: Todo[] }) {
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div
      className="mb-4"
      role="progressbar"
      aria-label="Todo progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-valuetext={`${completed} of ${total} completed (${percent}%)`}
    >
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-green-500 transition-all duration-200"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {completed} of {total} complete &middot; {percent}%
      </p>
    </div>
  );
}
