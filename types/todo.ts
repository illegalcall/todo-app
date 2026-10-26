// #103 — Todo type definition + sample data
// #275/#265 — optional due date field

/** A single todo item in the Daybook app. */
export interface Todo {
  /** Stable unique identifier. */
  id: string;
  /** Human-readable task description. */
  title: string;
  /** Whether the task has been completed. */
  completed: boolean;
  /** Optional due date in ISO format (yyyy-mm-dd). */
  dueDate?: string;
}

/** Seed data used to populate the list on first render. */
export const sampleTodos: Todo[] = [
  { id: "1", title: "Write the morning journal entry", completed: true },
  { id: "2", title: "Review the day's priorities", completed: false },
  { id: "3", title: "Take a 20 minute walk", completed: false },
];
