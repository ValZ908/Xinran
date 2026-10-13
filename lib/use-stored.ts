"use client";

import { useCallback, useSyncExternalStore } from "react";

// Nilai kecil di localStorage yang aman untuk SSR dan ikut ter-update
// di semua komponen yang memakainya.
const EVENT = "xinran-stored-change";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useStoredNumber(key: string, fallback = 0) {
  const value = useSyncExternalStore(
    subscribe,
    () => {
      try {
        const v = Number(localStorage.getItem(key));
        return Number.isFinite(v) && localStorage.getItem(key) !== null ? v : fallback;
      } catch {
        return fallback;
      }
    },
    () => fallback,
  );
  const set = useCallback(
    (v: number) => {
      try {
        localStorage.setItem(key, String(v));
      } catch {}
      window.dispatchEvent(new Event(EVENT));
    },
    [key],
  );
  return [value, set] as const;
}
