"use client";

import { useCallback, useSyncExternalStore } from "react";

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

const parseCache = new Map<string, { raw: string | null; value: unknown }>();

function parseWithCache<T>(key: string, raw: string | null, fallback: T): T {
  const cached = parseCache.get(key);
  if (cached && cached.raw === raw) {
    return cached.value as T;
  }
  let value: T = fallback;
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = fallback;
    }
  }
  parseCache.set(key, { raw, value });
  return value;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const getSnapshot = useCallback(() => readRaw(key), [key]);
  const getServerSnapshot = useCallback(() => null, []);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = typeof window !== "undefined";
  const value = parseWithCache<T>(key, raw, initialValue);

  const setter = useCallback(
    (next: T | ((prev: T) => T)) => {
      const current = parseWithCache<T>(key, readRaw(key), initialValue);
      const resolved =
        typeof next === "function" ? (next as (prev: T) => T)(current) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
        window.dispatchEvent(new StorageEvent("storage", { key }));
      } catch {
        // Quota exceeded or storage disabled — silently ignore.
      }
    },
    [key, initialValue],
  );

  return [value, setter, hydrated];
}
