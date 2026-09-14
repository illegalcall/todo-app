// #286 — Persistence and due-date regressions
import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import {
  loadTodos,
  parseTodos,
  readTodosSnapshot,
  saveTodos,
  subscribeTodos,
} from "../lib/storage";
import { isOverdue, localDateKey } from "../lib/dates";

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
afterEach(() => {
  if (originalWindow)
    Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
});

function installStorage(initial: string | null, throws = false) {
  let value = initial;
  const target = new EventTarget();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem() {
          if (throws) throw new Error("blocked");
          return value;
        },
        setItem(_key: string, next: string) {
          if (throws) throw new Error("quota");
          value = next;
        },
      },
      addEventListener: target.addEventListener.bind(target),
      removeEventListener: target.removeEventListener.bind(target),
    },
  });
  return { read: () => value, target };
}

const todo = {
  id: "one",
  title: "Keep my task",
  completed: false,
  dueDate: "2026-09-15",
};

test("module imports and storage reads are safe during server rendering", () => {
  Reflect.deleteProperty(globalThis, "window");
  assert.equal(readTodosSnapshot(), null);
  assert.equal(saveTodos([]), false);
  assert.ok(loadTodos().length > 0);
});

test("saved empty lists survive a reload rather than restoring samples", () => {
  installStorage(JSON.stringify([todo]));
  assert.equal(saveTodos([]), true);
  assert.deepEqual(loadTodos(), []);
});

test("malformed and invalid saved records fall back without throwing", () => {
  for (const raw of [
    "{",
    "null",
    '"hello"',
    "[{}]",
    JSON.stringify([{ ...todo, dueDate: "2026-02-30" }]),
    JSON.stringify([todo, todo]),
  ]) {
    assert.deepEqual(parseTodos(raw), parseTodos(null));
  }
  assert.deepEqual(parseTodos(JSON.stringify([todo])), [todo]);
});

test("successful writes preserve due dates and notify mounted subscribers", () => {
  const storage = installStorage(null);
  let count = 0;
  const unsubscribe = subscribeTodos(() => {
    count += 1;
  });
  assert.equal(saveTodos([todo]), true);
  assert.deepEqual(JSON.parse(storage.read()!), [todo]);
  assert.equal(count, 1);
  unsubscribe();
  saveTodos([]);
  assert.equal(count, 1);
});

test("blocked storage reads and writes are recoverable and do not claim success", () => {
  installStorage(null, true);
  let count = 0;
  const unsubscribe = subscribeTodos(() => {
    count += 1;
  });
  assert.doesNotThrow(loadTodos);
  assert.equal(saveTodos([todo]), false);
  assert.equal(count, 0);
  unsubscribe();
});

test("overdue means an unfinished task before the local calendar date", () => {
  const today = localDateKey(new Date(2026, 8, 14, 23, 59));
  assert.equal(today, "2026-09-14");
  assert.equal(isOverdue({ ...todo, dueDate: "2026-09-13" }, today), true);
  assert.equal(isOverdue({ ...todo, dueDate: today }, today), false);
  assert.equal(isOverdue(todo, today), false);
  assert.equal(
    isOverdue({ ...todo, completed: true, dueDate: "2026-09-13" }, today),
    false,
  );
  assert.equal(isOverdue({ ...todo, dueDate: undefined }, today), false);
  assert.equal(isOverdue(todo, ""), false);
});
