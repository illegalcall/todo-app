# Daybook house rules

These are binding on every pull request. Reviewers must cite the rule number.

1. **No `any`.** Use a real type or `unknown` with a narrowing check.
2. **Every exported symbol carries a TSDoc comment** (`/** ... */`), matching
   the style already used in `types/todo.ts`.
3. **Browser APIs must be SSR-safe.** This is the Next.js App Router: a
   `"use client"` component still renders on the server. Never touch
   `window`, `document` or `localStorage` during render or module scope —
   only inside `useEffect` or behind a `typeof window !== "undefined"` guard.
4. **Never trust persisted data.** Anything read back from `localStorage` is
   attacker- or corruption-controlled. Parse defensively and fall back to a
   known-good default rather than throwing.
5. **Interactive elements need an accessible name** — `aria-label` or visible
   text. The list already sets `aria-label` / `aria-live`; keep that up.
6. **Keep the file-header issue comment** (`// #NNN — short description`) at
   the top of every file, matching the existing convention.
