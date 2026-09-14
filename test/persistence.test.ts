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
    JSON.stringify([todo, todo]),
  ]) {
    assert.deepEqual(parseTodos(raw), parseTodos(null));
  }
  assert.deepEqual(parseTodos(JSON.stringify([todo])), [todo]);
});

test("successful writes preserve tasks and notify mounted subscribers", () => {
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

