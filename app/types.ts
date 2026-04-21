export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export const sampleTodos: Todo[] = [
  {
    id: "1",
    title: "Learn Next.js App Router",
    completed: true,
    createdAt: new Date("2026-04-15T09:00:00Z"),
  },
  {
    id: "2",
    title: "Build a todo app",
    completed: false,
    createdAt: new Date("2026-04-18T10:30:00Z"),
  },
  {
    id: "3",
    title: "Write tests",
    completed: false,
    createdAt: new Date("2026-04-20T14:15:00Z"),
  },
];
