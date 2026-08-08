import type { Todo } from "./types";

export const sampleTodos: Todo[] = [
  {
    id: "1",
    title: "Learn Next.js App Router",
    description: "Read the docs and build a small example.",
    completed: true,
    createdAt: new Date("2026-04-01T09:00:00Z"),
  },
  {
    id: "2",
    title: "Set up Todo type definitions",
    completed: true,
    createdAt: new Date("2026-04-15T10:30:00Z"),
  },
  {
    id: "3",
    title: "Wire up the todo list UI",
    description: "Render sampleTodos on the home page.",
    completed: false,
    createdAt: new Date("2026-04-20T14:00:00Z"),
  },
];
