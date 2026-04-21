export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export const sampleTodos: Todo[] = [
  {
    id: "1",
    title: "Write project README",
    completed: true,
    createdAt: "2026-04-18T09:00:00.000Z",
  },
  {
    id: "2",
    title: "Set up CI pipeline",
    completed: true,
    createdAt: "2026-04-19T10:30:00.000Z",
  },
  {
    id: "3",
    title: "Implement todo list UI",
    completed: false,
    createdAt: "2026-04-20T14:15:00.000Z",
  },
  {
    id: "4",
    title: "Add persistence layer",
    completed: false,
    createdAt: "2026-04-21T08:45:00.000Z",
  },
];
