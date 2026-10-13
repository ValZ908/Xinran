"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { SENBATSU_PHOTOS } from "@/lib/photos";

type Group = "Top Girls" | "Undergirls";

type Election = {
  n: number;
  rank: number | null;
  group?: Group;
  award?: "Bronze Award" | "Silver Award";
  note?: string;
  year?: number;
  photo?: string;
};

const ELECTIONS: Election[] = [
  { n: 2, rank: 23, group: "Undergirls" },
  { n: 3, rank: 18, group: "Undergirls" },
  { n: 4, rank: 29, group: "Undergirls" },
  { n: 5, rank: 19, group: "Undergirls" },
  { n: 6, rank: 8, group: "Top Girls" },
  {
    n: 7,
    rank: 3,
    group: "Top Girls",
    award: "Bronze Award",
    year: 2020,
    photo:
      SENBATSU_PHOTOS[2020],
  },
  { n: 8, rank: 4, group: "Top Girls" },
  { n: 9, rank: 11, group: "Top Girls" },
  {
    n: 10,
    rank: 3,
    group: "Top Girls",
    award: "Bronze Award",
    year: 2023,
    photo: SENBATSU_PHOTOS[2023],
  },
  { n: 11, rank: 5, group: "Top Girls" },
  {
    n: 12,
    rank: 2,
    group: "Top Girls",
    award: "Silver Award",
    note: "Gei Weilai de Women",
    year: 2025,
    photo: SENBATSU_PHOTOS[2025],
  },
  { n: 13, rank: null },
];

const MEDAL: Record<string, string> = {
  "Bronze Award": "🥉",
  "Silver Award": "🥈",
};

// Warna titik per kelompok. Teks tetap memakai warna teks biasa.
const COLOR: Record<Group, string> = {
  "Top Girls": "#fb7185", // rose-400
  Undergirls: "#a1a1aa", // zinc-400
};

const MAX_RANK = 32;
const PAD = { top: 28, right: 16, bottom: 34, left: 40 };

const ranked = ELECTIONS.filter((e) => e.rank !== null);
const best = Math.min(...ranked.map((e) => e.rank!));
const topCount = ranked.filter((e) => e.group === "Top Girls").length;

export default function SenbatsuSection() {
  const { t: dict } = useLang();
  const t = dict.senbatsu;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const plotRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [selected, setSelected] = useState(ELECTIONS.length - 2); // 12th
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = plotRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight")
        setSelected((s) => Math.min(ELECTIONS.length - 1, s + 1));
      if (e.key === "ArrowLeft") setSelected((s) => Math.max(0, s - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView]);

  const { w, h } = size;
  const iw = Math.max(0, w - PAD.left - PAD.right);
  const ih = Math.max(0, h - PAD.top - PAD.bottom);
  const step = iw / ELECTIONS.length;
  const x = (i: number) => PAD.left + step * (i + 0.5);
  const y = (rank: number) => PAD.top + ((rank - 1) / (MAX_RANK - 1)) * ih;

  const points = ELECTIONS.map((e, i) =>
    e.rank === null ? null : ([x(i), y(e.rank)] as const),
  );
  const path = points
    .filter((p): p is readonly [number, number] => p !== null)
    .map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`)
    .join("");

  const current = ELECTIONS[selected];
  const prev = selected > 0 ? ELECTIONS[selected - 1] : null;
  const delta =
    current.rank !== null && prev?.rank != null ? prev.rank - current.rank : null;
  const tip = hover !== null ? ELECTIONS[hover] : null;

  return (
    <section
      id="senbatsu"
      ref={ref}
      className="relative flex h-[100svh] w-full shrink-0 snap-start flex-col overflow-hidden bg-black"
    >
      <div className="pointer-events-none absolute -right-1/4 top-0 size-[60vmax] rounded-full bg-rose-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-8 pt-16 md:px-10 md:pt-20">
        {/* Judul + angka ringkas */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-300/80">
              {t.label}
            </p>
            <h2 className="mt-3 font-serif text-4xl font-black tracking-tight text-white sm:text-6xl">
              {t.title}
            </h2>
          </motion.div>
          <motion.dl
            className="flex gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ delay: 0.3 }}
          >
            {[
              [t.bestRank, `#${best}`],
              [t.topGirls, `${topCount}×`],
              [t.elections, `${ranked.length}`],
            ].map(([label, value]) => (
              <div key={label}>
                <dd className="font-serif text-3xl font-black text-white">{value}</dd>
                <dt className="text-xs uppercase tracking-widest text-zinc-500">{label}</dt>
              </div>
            ))}
          </motion.dl>
        </div>

        <div className="mt-6 grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-5 md:grid-cols-[minmax(0,1fr)_300px] md:grid-rows-1">
          {/* Grafik peringkat */}
          <div className="relative grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] rounded-3xl border border-white/10 bg-white/[0.03] p-3 md:p-4">
            <div className="flex items-center gap-4 px-2 text-xs text-zinc-400">
              {(Object.keys(COLOR) as Group[]).map((g) => (
                <span key={g} className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full" style={{ background: COLOR[g] }} />
                  {g}
                </span>
              ))}
              <span className="ml-auto hidden text-zinc-600 sm:inline">
                {t.higherBetter}
              </span>
            </div>

            <div
              ref={plotRef}
              className="relative h-full min-h-0"
              onMouseLeave={() => setHover(null)}
            >
              {w > 0 && (
                <svg width={w} height={h} className="absolute inset-0 overflow-visible">
                  {/* Area Top 16 */}
                  <rect
                    x={PAD.left}
                    y={PAD.top - 6}
                    width={iw}
                    height={y(16.5) - PAD.top + 6}
                    rx={10}
                    fill="rgba(251,113,133,0.06)"
                  />
                  <line
                    x1={PAD.left}
                    x2={PAD.left + iw}
                    y1={y(16.5)}
                    y2={y(16.5)}
                    stroke="rgba(251,113,133,0.35)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={PAD.left + iw - 6}
                    y={y(16.5) - 6}
                    textAnchor="end"
                    className="fill-zinc-500 text-[10px] uppercase tracking-widest"
                  >
                    Top 16
                  </text>

                  {/* Garis bantu peringkat */}
                  {[1, 8, 16, 24, 32].map((r) => (
                    <g key={r}>
                      <line
                        x1={PAD.left}
                        x2={PAD.left + iw}
                        y1={y(r)}
                        y2={y(r)}
                        stroke="rgba(255,255,255,0.06)"
                      />
                      <text
                        x={PAD.left - 10}
                        y={y(r) + 4}
                        textAnchor="end"
                        className="fill-zinc-500 text-[11px]"
                      >
                        #{r}
                      </text>
                    </g>
                  ))}

                  {/* Crosshair kolom yang di-hover */}
                  {hover !== null && (
                    <line
                      x1={x(hover)}
                      x2={x(hover)}
                      y1={PAD.top - 6}
                      y2={PAD.top + ih}
                      stroke="rgba(255,255,255,0.25)"
                    />
                  )}

                  {/* Garis perjalanan peringkat */}
                  <motion.path
                    d={path}
                    fill="none"
                    stroke="url(#rank-line)"
                    strokeWidth={2}
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: inView ? 1 : 0 }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                  />
                  <defs>
                    <linearGradient id="rank-line" x1="0" x2="1">
                      <stop offset="0%" stopColor={COLOR.Undergirls} />
                      <stop offset="40%" stopColor={COLOR["Top Girls"]} />
                      <stop offset="100%" stopColor={COLOR["Top Girls"]} />
                    </linearGradient>
                  </defs>

                  {/* Titik + label */}
                  {ELECTIONS.map((e, i) => {
                    const p = points[i];
                    const isSel = i === selected;
                    return (
                      <g key={e.n}>
                        {p ? (
                          <>
                            {isSel && (
                              <motion.circle
                                cx={p[0]}
                                cy={p[1]}
                                fill="none"
                                stroke={COLOR[e.group!]}
                                strokeWidth={1.5}
                                initial={{ r: 6, opacity: 1 }}
                                animate={{ r: 16, opacity: 0 }}
                                transition={{ duration: 1.4, repeat: Infinity }}
                              />
                            )}
                            <motion.circle
                              cx={p[0]}
                              cy={p[1]}
                              fill={COLOR[e.group!]}
                              stroke="#000"
                              strokeWidth={2}
                              initial={{ r: 0 }}
                              animate={{ r: inView ? (isSel || hover === i ? 8 : 5.5) : 0 }}
                              transition={{
                                delay: inView ? 0.15 * i : 0,
                                type: "spring",
                                stiffness: 300,
                                damping: 18,
                              }}
                            />
                            {(e.award || isSel) && (
                              <text
                                x={p[0]}
                                y={p[1] - 14}
                                textAnchor="middle"
                                className="fill-white text-[12px] font-bold"
                              >
                                {e.award ? `${MEDAL[e.award]} ` : ""}#{e.rank}
                              </text>
                            )}
                          </>
                        ) : (
                          <text
                            x={x(i)}
                            y={PAD.top + ih - 4}
                            textAnchor="middle"
                            className="fill-zinc-600 text-[10px] font-semibold"
                          >
                            {t.dnpShort}
                          </text>
                        )}
                        <text
                          x={x(i)}
                          y={h - 10}
                          textAnchor="middle"
                          className={`text-[10px] sm:text-[11px] ${
                            isSel ? "fill-white font-bold" : "fill-zinc-500"
                          }`}
                        >
                          {t.short(e.n)}
                        </text>
                        {/* Area klik lebih besar dari titiknya */}
                        <rect
                          x={x(i) - step / 2}
                          y={0}
                          width={step}
                          height={h}
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={() => setHover(i)}
                          onClick={() => setSelected(i)}
                        />
                      </g>
                    );
                  })}
                </svg>
              )}

              {/* Tooltip */}
              <AnimatePresence>
                {tip && hover !== null && (
                  <motion.div
                    key="tip"
                    className="pointer-events-none absolute z-20 w-max -translate-x-1/2 rounded-xl border border-white/10 bg-zinc-900/95 px-3 py-2 text-xs shadow-xl backdrop-blur"
                    style={{
                      left: Math.min(Math.max(x(hover), 70), w - 70),
                      top: points[hover] ? Math.max(points[hover]![1] - 74, 0) : ih / 2,
                    }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <p className="font-semibold text-white">
                      {t.election(tip.n)}
                    </p>
                    <p className="text-zinc-400">
                      {tip.rank === null
                        ? t.dnpTip
                        : `#${tip.rank} · ${tip.group}`}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Versi tabel untuk pembaca layar */}
            <table className="sr-only">
              <caption>{t.caption}</caption>
              <thead>
                <tr>
                  {t.cols.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ELECTIONS.map((e) => (
                  <tr key={e.n}>
                    <td>{t.short(e.n)}</td>
                    <td>{e.rank ?? t.dnpTip}</td>
                    <td>{e.group ?? "-"}</td>
                    <td>{e.award ? t.awards[e.award] : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Panel detail */}
          <div className="relative flex items-center gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-rose-500/15 to-transparent p-5 md:flex-col md:items-stretch md:justify-between md:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                className="flex min-h-0 min-w-0 flex-1 items-center gap-4 md:flex-col md:items-stretch"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {current.photo && (
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-white/10 md:h-auto md:min-h-28 md:w-full md:flex-1 md:rounded-2xl">
                    <Image
                      src={current.photo}
                      alt={t.photoAlt(current.n, current.year)}
                      fill
                      sizes="(min-width: 768px) 300px, 80px"
                      className="object-cover object-top"
                    />
                  </div>
                )}
                <div className="min-w-0">
                <p className="text-xs uppercase tracking-widest text-zinc-400">
                  {t.election(current.n)}
                  {current.year && ` · ${current.year}`}
                </p>
                {current.rank === null ? (
                  <p className="mt-2 font-serif text-3xl font-black text-zinc-500 md:text-4xl">
                    {t.dnp}
                  </p>
                ) : (
                  <>
                    <p className="mt-1 font-serif text-6xl font-black leading-none text-white md:mt-3 md:text-8xl">
                      #{current.rank}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className="rounded-full px-2.5 py-1 font-bold text-black"
                        style={{ background: COLOR[current.group!] }}
                      >
                        {current.group}
                      </span>
                      {current.award && (
                        <span className="rounded-full border border-white/15 px-2.5 py-1 font-semibold text-white">
                          {MEDAL[current.award]} {t.awards[current.award]}
                        </span>
                      )}
                      {delta !== null && delta !== 0 && (
                        <span className={delta > 0 ? "text-emerald-400" : "text-zinc-500"}>
                          {delta > 0 ? "▲" : "▼"} {Math.abs(delta)} {t.vs(prev!.n)}
                        </span>
                      )}
                    </div>
                    {current.note && (
                      <p className="mt-3 text-sm italic text-zinc-300">
                        “{current.note}”
                      </p>
                    )}
                  </>
                )}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex shrink-0 gap-2 md:justify-between">
              <button
                type="button"
                onClick={() => setSelected((s) => Math.max(0, s - 1))}
                disabled={selected === 0}
                aria-label={t.prev}
                className="grid size-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-white/30 hover:text-white disabled:opacity-30"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="hidden self-center text-[11px] uppercase tracking-widest text-zinc-600 md:block">
                {t.clickPoint}
              </span>
              <button
                type="button"
                onClick={() =>
                  setSelected((s) => Math.min(ELECTIONS.length - 1, s + 1))
                }
                disabled={selected === ELECTIONS.length - 1}
                aria-label={t.next}
                className="grid size-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-white/30 hover:text-white disabled:opacity-30"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
