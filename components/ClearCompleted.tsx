// #286 — Clear completed tasks
/** Remove completed tasks with an explicitly named button. */
export default function ClearCompleted({ onClear }: { onClear: () => void }) {
  return (
    <button
      type="button"
      aria-label="Clear completed"
      onClick={onClear}
      className="rounded-md border border-gray-300 px-2 py-1 text-sm"
    >
      Clear completed
    </button>
  );
}
