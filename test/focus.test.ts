import test from "node:test";
import assert from "node:assert/strict";
import {
  formatCountdown,
  remainingFocusMs,
  serverClockSnapshot,
} from "../lib/day";
import { loadTodos, saveTodos } from "../lib/storage";

test("delayed callbacks catch up with elapsed time and stop at the deadline", () => {
  const start = 100_000;
  const deadline = start + 25 * 60_000;
  assert.equal(remainingFocusMs(deadline, start + 10 * 60_000), 15 * 60_000);
  assert.equal(remainingFocusMs(deadline, deadline + 5 * 60_000), 0);
  assert.equal(
    formatCountdown(remainingFocusMs(deadline, start + 1500) / 1000),
    "24:58",
  );
});

test("paused duration can resume against a new deadline without counting the pause", () => {
  const paused = remainingFocusMs(1_500_000, 25_250);
  const resumedAt = 3_000_000;
  assert.equal(
    remainingFocusMs(resumedAt + paused, resumedAt + 250),
    1_474_500,
  );
});

test("server clock is deterministic and storage functions are safe without a browser", () => {
  assert.equal(serverClockSnapshot(), 0);
  assert.equal(loadTodos(), null);
  assert.equal(saveTodos([]), false);
});

test("storage reports failures and preserves valid saved empty lists", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  try {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        localStorage: {
          getItem: () => "[]",
          setItem: () => {
            throw new Error("quota");
          },
        },
      },
    });
    assert.deepEqual(loadTodos(), []);
    assert.equal(saveTodos([]), false);
  } finally {
    if (original) Object.defineProperty(globalThis, "window", original);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
