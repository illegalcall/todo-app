"use client";

import { createContext, useContext, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { sampleTodos } from "@/types/todo";
import type { Todo } from "@/types/todo";

const TodoContext = createContext<[Todo[], Dispatch<SetStateAction<Todo[]>>] | null>(null);

/** Keep the current list alive while moving between Today and Field notes. */
export function TodoProvider({ children }: { children: ReactNode }) {
  const state = useState<Todo[]>(sampleTodos);
  return <TodoContext.Provider value={state}>{children}</TodoContext.Provider>;
}

export function useTodos() {
  const state = useContext(TodoContext);
  if (!state) throw new Error("useTodos requires TodoProvider");
  return state;
}
