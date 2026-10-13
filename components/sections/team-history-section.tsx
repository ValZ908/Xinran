"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useLang } from "@/lib/i18n";
import type { Dict } from "@/lib/dictionaries";

// Warna tim SNH48: Team X hijau, Team HII oranye.
const X = "#8cc63f";
const HII = "#f39800";
const TRAINEE = "#a1a1aa";

type Event = {
  date: string;
  iso: string;
  team: string;
  colors: string[];
};

const EVENTS: Event[] = [
  {
    date: "2015.01.31",
    iso: "2015-01-31",
    team: "Trainee",
    colors: [TRAINEE],
  },
  {
    date: "2015.04.17",
    iso: "2015-04-17",
    team: "X",
    colors: [X],
  },
  {
    date: "2025.08.29",
    iso: "2025-08-29",
    team: "X + HII",
    colors: [X, HII],
  },
  {
    date: "2026.08.30",
    iso: "2026-08-30",
    team: "HII",
    colors: [HII],
  },
];

const DAY = 86_400_000;

// Teks jarak waktu antara dua titik di timeline.
function gap(a: string, b: string, t: Dict["teamHistory"]) {
  const days = Math.round((Date.parse(b) - Date.parse(a)) / DAY);
  if (days < 365) return t.days(days);
  const years = days / 365.25;
  return t.years(years.toFixed(1));
}

const teamGradient = (colors: string[]) =>
  colors.length > 1
    ? `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`
    : colors[0];

export default function TeamHistorySection() {
  const { t: dict } = useLang();
  const t = dict.teamHistory;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);

  const go = useCallback(
    (i: number) => setActive((i + EVENTS.length) % EVENTS.length),
    [],
  );

  // Putar otomatis selama section terlihat dan tidak di-hover.
  useEffect(() => {
    if (!inView || !playing || hovered) return;
    const t = setTimeout(() => go(active + 1), 4500);
    return () => clearTimeout(t);
  }, [active, inView, playing, hovered, go]);

  // Panah kiri/kanan untuk pindah titik.
  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(active + 1);
      if (e.key === "ArrowLeft") go(active - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, inView, go]);

  const event = EVENTS[active];
  const text = t.events[active];
  const teamLabel = (team: string) => (team === "Trainee" ? t.trainee : t.team(team));
  const accent = event.colors[event.colors.length - 1];
  const yearsInX = gap("2015-04-17", "2026-08-30", t);

  return (
    <section
      id="team-history"
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex h-[100svh] w-full shrink-0 snap-start flex-col overflow-hidden bg-zinc-950"
    >
      {/* Nama tim raksasa di belakang */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={event.team}
            className="select-none whitespace-nowrap font-serif text-[28vw] font-black leading-none text-transparent md:text-[22vw]"
            style={{
              WebkitTextStroke: `2px ${accent}`,
              opacity: 0.18,
            }}
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 0.18, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -40 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {event.team === "Trainee" ? "SNH48" : event.team}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Cahaya warna tim */}
      <motion.div
        className="pointer-events-none absolute -top-1/3 left-1/2 size-[80vmax] -translate-x-1/2 rounded-full blur-3xl"
        animate={{ backgroundColor: accent, opacity: 0.12 }}
        transition={{ duration: 0.8 }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 pt-16 md:px-10">
        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-300/80"
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        >
          {t.label}
        </motion.p>
        <motion.h2
          className="mt-3 font-serif text-4xl font-black tracking-tight text-white sm:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.1 }}
        >
          {t.title}
        </motion.h2>

        {/* Kartu event yang aktif */}
        <div className="mt-10 min-h-[220px] md:min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.article
              key={`${active}-${text.title}`}
              className="max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md md:p-8"
              initial={{ opacity: 0, y: 24, rotateX: -12 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -24, rotateX: 12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformPerspective: 800 }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest text-black"
                  style={{ background: teamGradient(event.colors) }}
                >
                  {teamLabel(event.team)}
                </span>
                <span className="font-mono text-sm text-zinc-400">
                  {event.date}
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-bold text-white md:text-3xl">
                {text.title}
              </h3>
              <p className="mt-2 text-zinc-400">{text.detail}</p>
            </motion.article>
          </AnimatePresence>
        </div>

        {/* Statistik kecil */}
        <motion.div
          className="mt-6 flex flex-wrap gap-6 text-sm text-zinc-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ delay: 0.4 }}
        >
          <p>
            <span className="block font-serif text-3xl font-black text-white">
              {yearsInX}
            </span>
            {t.inTeamX}
          </p>
          <p>
            <span className="block font-serif text-3xl font-black text-white">
              {gap("2015-01-31", "2026-08-30", t)}
            </span>
            {t.beforeHII}
          </p>
        </motion.div>
      </div>

      {/* Timeline */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-14 md:px-10">
        <div className="relative">
          {/* Jalur */}
          <div className="absolute left-0 right-0 top-[11px] h-0.5 rounded-full bg-white/10" />
          <motion.div
            className="absolute left-0 top-[11px] h-0.5 rounded-full"
            style={{ background: `linear-gradient(90deg, ${TRAINEE}, ${X} 35%, ${HII})` }}
            animate={{ width: `${(active / (EVENTS.length - 1)) * 100}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />

          <ol className="relative grid grid-cols-4">
            {EVENTS.map((e, i) => {
              const done = i <= active;
              return (
                <li key={e.iso} className="relative flex flex-col items-start first:items-start last:items-end [&:not(:first-child):not(:last-child)]:items-center">
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`${e.date}: ${t.events[i].title}`}
                    aria-current={i === active ? "step" : undefined}
                    className="group flex flex-col items-center gap-3 outline-none"
                  >
                    <motion.span
                      className="relative grid size-6 place-items-center rounded-full border-2 bg-zinc-950"
                      animate={{
                        borderColor: done ? e.colors[e.colors.length - 1] : "rgba(255,255,255,0.25)",
                        scale: i === active ? 1.25 : 1,
                      }}
                      whileHover={{ scale: 1.4 }}
                    >
                      <motion.span
                        className="size-2.5 rounded-full"
                        style={{ background: teamGradient(e.colors) }}
                        animate={{ opacity: done ? 1 : 0.25 }}
                      />
                      {i === active && (
                        <motion.span
                          layoutId="timeline-ring"
                          className="absolute -inset-2 rounded-full border"
                          style={{ borderColor: accent }}
                        />
                      )}
                    </motion.span>
                    <span
                      className={`font-mono text-[10px] transition-colors sm:text-xs ${
                        i === active ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                      }`}
                    >
                      {e.date}
                    </span>
                  </button>
                  {/* Jarak waktu ke titik berikutnya */}
                  {i < EVENTS.length - 1 && (
                    <span className="pointer-events-none absolute -top-6 left-1/2 hidden translate-x-1/4 whitespace-nowrap text-[10px] uppercase tracking-widest text-zinc-600 sm:block">
                      {gap(e.iso, EVENTS[i + 1].iso, t)}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Kontrol */}
        <div className="mt-6 flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label={t.prev}
            className="grid size-9 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-white/30 hover:text-white"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? t.pause : t.play}
            className="grid size-9 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-white/30 hover:text-white"
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label={t.next}
            className="grid size-9 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-white/30 hover:text-white"
          >
            <ChevronRight className="size-4" />
          </button>
          <span className="ml-2 text-[11px] uppercase tracking-widest text-zinc-600">
            {t.keysHint}
          </span>
        </div>
      </div>
    </section>
  );
}
