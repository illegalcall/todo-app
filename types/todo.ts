// #103 — Todo type definition + sample data

/** A single todo item in the Daybook app. */
export interface Todo {
  /** Stable unique identifier. */
  id: string;
  /** Human-readable task description. */
  text: string;
  /** Whether the task has been completed. */
  completed: boolean;
}

/** Seed data used to populate the list on first render. */
export const sampleTodos: Todo[] = [
  { id: "1", text: "Write the morning journal entry", completed: true },
  { id: "2", text: "Review the day's priorities", completed: false },
  { id: "3", text: "Take a 20 minute walk", completed: false },
];
