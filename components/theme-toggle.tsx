"use client";

import { useState, useSyncExternalStore, type CSSProperties } from "react";

type Theme = "dark" | "pink";

// Tema tinggal di <html data-theme>, diset dulu oleh script di layout supaya tidak berkedip.
const subscribe = (cb: () => void) => {
  window.addEventListener("themechange", cb);
  return () => window.removeEventListener("themechange", cb);
};
const getTheme = (): Theme => (document.documentElement.dataset.theme === "pink" ? "pink" : "dark");

/** Ganti tema dengan lingkaran yang melebar dari tombol (View Transitions), kalau browser mendukung. */
const setTheme = (t: Theme, x: number, y: number) => {
  const apply = () => {
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem("theme", t);
    } catch {}
    window.dispatchEvent(new Event("themechange"));
  };
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
  if (!doc.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  doc.startViewTransition(apply).ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 750, easing: "cubic-bezier(.4,0,.2,1)", pseudoElement: "::view-transition-new(root)" },
    );
  });
};

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);
  const pink = theme === "pink";
  const [burst, setBurst] = useState(0);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={pink}
      aria-label="Pink mode"
      title={pink ? "Ganti ke dark mode" : "Ganti ke pink mode"}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTheme(pink ? "dark" : "pink", r.left + r.width / 2, r.top + r.height / 2);
        setBurst((b) => b + 1);
      }}
      className="theme-switch glass fixed right-3 top-3 z-50 h-11 w-[5.5rem] rounded-full md:right-6 md:top-5"
    >
      {/* petunjuk tema seberang, samar di jalur */}
      <span aria-hidden className="absolute inset-y-0 right-3 flex items-center text-sm opacity-50 transition-opacity duration-500 pink:opacity-0">
        🌸
      </span>
      <span aria-hidden className="absolute inset-y-0 left-3 flex items-center text-sm opacity-0 transition-opacity duration-500 pink:opacity-50">
        🌙
      </span>

      <span aria-hidden className="theme-knob glass-thumb absolute left-1 top-1 grid h-9 place-items-center rounded-full">
        <span className="absolute rotate-0 scale-100 transition duration-500 pink:rotate-180 pink:scale-0">🌙</span>
        <span className="absolute -rotate-180 scale-0 transition duration-500 pink:rotate-0 pink:scale-100">🌸</span>
      </span>

      {burst > 0 && (
        <span key={burst} aria-hidden className="pointer-events-none absolute inset-0">
          {Array.from({ length: 10 }, (_, i) => (
            <span
              key={i}
              className="theme-particle absolute left-1/2 top-1/2 text-xs"
              style={{ "--a": `${i * 36}deg`, "--d": `${34 + (i % 3) * 10}px` } as CSSProperties}
            >
              {pink ? "🌸" : "✨"}
            </span>
          ))}
        </span>
      )}
    </button>
  );
}
