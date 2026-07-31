/** Priority bands that shape the day's orbit. */
export type Priority = "now" | "next" | "later";

/** Filter applied to the visible todo list. */
export type TodoFilter = "all" | "active" | "completed";

/** A single todo item in the Daybook app. */
export interface Todo {
  /** Stable unique identifier. */
  id: string;
  /** Human-readable task description. */
  title: string;
  /** Whether the task has been completed. */
  completed: boolean;
  /** How soon this task should pull attention. */
  priority: Priority;
  /** ISO timestamp when the todo was created. */
  createdAt: string;
  /** Optional due time as HH:mm (local). */
  dueTime?: string;
}

/** Seed data used when local storage is empty. */
export const sampleTodos: Todo[] = [
  {
    id: "1",
    title: "Write the morning journal entry",
    completed: true,
    priority: "now",
    createdAt: new Date().toISOString(),
    dueTime: "08:30",
  },
  {
    id: "2",
    title: "Review the day's priorities",
    completed: false,
    priority: "now",
    createdAt: new Date().toISOString(),
    dueTime: "09:00",
  },
  {
    id: "3",
    title: "Ship the focus block for Daybook",
    completed: false,
    priority: "next",
    createdAt: new Date().toISOString(),
    dueTime: "11:00",
  },
  {
    id: "4",
    title: "Take a 20 minute walk",
    completed: false,
    priority: "later",
    createdAt: new Date().toISOString(),
    dueTime: "16:30",
  },
];

export const PRIORITY_ORDER: Record<Priority, number> = {
  now: 0,
  next: 1,
  later: 2,
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  now: "Now",
  next: "Next",
  later: "Later",
};
