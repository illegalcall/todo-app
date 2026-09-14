import { test } from "node:test";
import assert from "node:assert/strict";
import { isOverdue, localDateKey } from "../lib/dates";
const todo = { id: "task", title: "Due task", completed: false, dueDate: "2026-09-14" };
test("only unfinished tasks before the current local day are overdue", () => {
 assert.equal(isOverdue(todo, "2026-09-14"), false);
 assert.equal(isOverdue(todo, "2026-09-15"), true);
 assert.equal(isOverdue({ ...todo, completed: true }, "2026-09-15"), false);
 assert.equal(isOverdue({ ...todo, dueDate: undefined }, "2026-09-15"), false);
 assert.equal(isOverdue(todo, ""), false);
});
test("local date changes at midnight", () => {
 assert.equal(localDateKey(new Date(2026, 8, 14, 23, 59)), "2026-09-14");
 assert.equal(localDateKey(new Date(2026, 8, 15, 0, 0)), "2026-09-15");
});
