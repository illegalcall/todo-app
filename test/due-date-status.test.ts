import { test } from "node:test";
import assert from "node:assert/strict";
import { getDueDateStatus } from "../lib/due-date-status";

test("badges distinguish overdue, today, near and later calendar dates", () => {
  assert.match(getDueDateStatus("2026-09-13", false, "2026-09-14").label, /Overdue/);
  assert.equal(getDueDateStatus("2026-09-14", false, "2026-09-14").label, "Due today");
  assert.match(getDueDateStatus("2026-09-17", false, "2026-09-14").label, /Due in 3d/);
  assert.doesNotMatch(getDueDateStatus("2026-09-18", false, "2026-09-14").label, /Due|Overdue/);
});

test("completed tasks and server rendering do not show urgency", () => {
  assert.match(getDueDateStatus("2026-09-13", true, "2026-09-14").className, /line-through/);
  assert.doesNotMatch(getDueDateStatus("2026-09-13", true, "2026-09-14").label, /Overdue/);
  assert.doesNotMatch(getDueDateStatus("2026-09-13", false, "").label, /Overdue/);
});

test("calendar badges update when midnight passes and across DST", () => {
  assert.equal(getDueDateStatus("2026-09-14", false, "2026-09-14").label, "Due today");
  assert.match(getDueDateStatus("2026-09-14", false, "2026-09-15").label, /Overdue/);
  assert.match(getDueDateStatus("2026-03-09", false, "2026-03-07").label, /Due in 2d/);
});
