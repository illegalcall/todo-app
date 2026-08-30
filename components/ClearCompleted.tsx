export default function ClearCompleted({ onClear }: { onClear: () => void }) {
  return (
    <button
      onClick={onClear}
      className="rounded-md border border-gray-300 px-2 py-1 text-sm"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" fill="none" />
      </svg>
    </button>
  );
}
