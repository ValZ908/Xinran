"use client";

import { useEffect, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type NavSection = { id: string; label: string };

export default function SectionNav({
  sections,
  containerRef,
}: {
  sections: NavSection[];
  containerRef: RefObject<HTMLElement | null>;
}) {
  const [active, setActive] = useState(0);

  // Tandai section yang sedang memenuhi layar.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = sections.findIndex((s) => s.id === entry.target.id);
          if (i >= 0) setActive(i);
        }
      },
      { root, threshold: 0.6 },
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [sections, containerRef]);

  const go = (i: number) => {
    const target = sections[Math.max(0, Math.min(sections.length - 1, i))];
    document.getElementById(target.id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Atas/bawah, PageUp/PageDown, dan spasi pindah satu section.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (["ArrowDown", "PageDown"].includes(e.key) || (e.key === " " && tag !== "BUTTON")) {
        e.preventDefault();
        go(active + 1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(active - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <>
      <nav
        aria-label="Sections"
        className="fixed right-3 top-1/2 z-50 flex -translate-y-1/2 flex-col items-end gap-3 md:right-6"
      >
        {sections.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => go(i)}
            aria-label={s.label}
            aria-current={i === active ? "true" : undefined}
            className="group flex items-center gap-3 py-1"
          >
            <span
              className={`pointer-events-none hidden text-[11px] font-semibold uppercase tracking-widest transition-all duration-300 md:block ${
                i === active
                  ? "text-white opacity-100"
                  : "translate-x-2 text-zinc-400 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              }`}
            >
              {s.label}
            </span>
            <motion.span
              className="block w-1.5 rounded-full"
              animate={{
                height: i === active ? 28 : 6,
                backgroundColor: i === active ? "#fda4af" : "rgba(255,255,255,0.35)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </button>
        ))}
      </nav>

      {/* Nomor section */}
      <div className="pointer-events-none fixed bottom-5 right-4 z-50 flex items-baseline gap-1 font-mono text-xs text-zinc-500 md:bottom-8 md:right-6">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={active}
            className="text-base text-white"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
          >
            {String(active + 1).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
        / {String(sections.length).padStart(2, "0")}
      </div>

      {/* Garis progres di atas */}
      <motion.div
        className="fixed left-0 top-0 z-50 h-0.5 bg-gradient-to-r from-rose-300 to-amber-200"
        animate={{ width: `${((active + 1) / sections.length) * 100}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </>
  );
}
