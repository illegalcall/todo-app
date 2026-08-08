export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export const sampleTodos: Todo[] = [
  {
    id: "1",
    title: "Learn Next.js App Router",
    completed: true,
    createdAt: "2026-04-01T09:00:00.000Z",
  },
  {
    id: "2",
    title: "Build a todo app",
    completed: false,
    createdAt: "2026-04-15T12:30:00.000Z",
  },
  {
    id: "3",
    title: "Write tests",
    completed: false,
    createdAt: "2026-04-21T08:15:00.000Z",
  },
];
