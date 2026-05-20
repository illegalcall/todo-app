export interface Todo {
  readonly id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type FilterMode = "all" | "active" | "completed";
