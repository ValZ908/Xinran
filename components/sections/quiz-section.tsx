"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Check, Download, RotateCcw, Share2, X } from "lucide-react";
import { useLang } from "@/lib/i18n";
import type { Dict } from "@/lib/dictionaries";
import { QUESTIONS, optionText } from "@/lib/quiz";
import { HERO_PHOTO } from "@/lib/photos";
import { downloadCanvas, drawCover, loadImage, shareCanvas, wrapText } from "@/lib/canvas";
import { useStoredNumber } from "@/lib/use-stored";

type Phase = "intro" | "play" | "done";
type T = Dict["quiz"];

const TOTAL = QUESTIONS.length;

function shuffle(n: number) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const tierFor = (t: T, score: number) => t.tiers.find((x) => score >= x.min)!;

async function drawResult(t: T, score: number) {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const tier = tierFor(t, score);

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#1c0a12");
  bg.addColorStop(1, "#000000");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const img = await loadImage(HERO_PHOTO);
  drawCover(ctx, img, 0, 0, W, 760, 0.3);
  const fade = ctx.createLinearGradient(0, 380, 0, 760);
  fade.addColorStop(0, "rgba(0,0,0,0)");
  fade.addColorStop(1, "#0d0508");
  ctx.fillStyle = fade;
  ctx.fillRect(0, 380, W, 380);

  ctx.textAlign = "center";
  ctx.fillStyle = "#fda4af";
  ctx.font = "600 34px system-ui, sans-serif";
  ctx.fillText(t.score.toUpperCase(), W / 2, 820);

  const scoreGrad = ctx.createLinearGradient(W / 2 - 200, 0, W / 2 + 200, 0);
  scoreGrad.addColorStop(0, "#fde68a");
  scoreGrad.addColorStop(1, "#fda4af");
  ctx.fillStyle = scoreGrad;
  ctx.font = "900 220px Georgia, serif";
  ctx.fillText(`${score}/${TOTAL}`, W / 2, 1030);

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 64px Georgia, serif";
  ctx.fillText(tier.title, W / 2, 1130);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = "400 36px system-ui, sans-serif";
  wrapText(ctx, tier.text, W / 2, 1195, W - 200, 48, 2);

  ctx.fillStyle = "#52525b";
  ctx.font = "600 28px system-ui, sans-serif";
  ctx.fillText("SONG XINRAN · SNH48", W / 2, H - 50);
  return canvas;
}

function ScoreRing({ score }: { score: number }) {
  const progress = useMotionValue(0);
  const shown = useTransform(progress, (v) => Math.round(v * TOTAL));
  const dash = useTransform(progress, (v) => `${v * 276.5} 276.5`);
  const [label, setLabel] = useState(0);

  useEffect(() => {
    const controls = animate(progress, score / TOTAL, { duration: 1.4, ease: [0.16, 1, 0.3, 1] });
    const unsub = shown.on("change", setLabel);
    return () => {
      controls.stop();
      unsub();
    };
  }, [progress, score, shown]);

  return (
    <div className="relative size-40 md:size-48">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <motion.circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="url(#quiz-ring)"
          strokeWidth="8"
          strokeLinecap="round"
          style={{ strokeDasharray: dash }}
        />
        <defs>
          <linearGradient id="quiz-ring" x1="0" x2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#fb7185" />
          </linearGradient>
        </defs>
      </svg>
      <p className="absolute inset-0 grid place-items-center font-serif text-5xl font-black text-white md:text-6xl">
        <span>
          {label}
          <span className="text-2xl text-zinc-500">/{TOTAL}</span>
        </span>
      </p>
    </div>
  );
}

export default function QuizSection() {
  const { t: dict, lang } = useLang();
  const t = dict.quiz;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.5 });

  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [orders, setOrders] = useState<number[][]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [shake, setShake] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [best, setBest] = useStoredNumber("xinran-quiz-best", -1);

  const question = QUESTIONS[index];
  const order = orders[index] ?? [];
  const answered = picked !== null;
  const isLast = index === TOTAL - 1;

  const start = () => {
    setOrders(QUESTIONS.map((q) => shuffle(q.options.length)));
    setIndex(0);
    setPicked(null);
    setScore(0);
    setPhase("play");
  };

  const pick = (option: number) => {
    if (answered) return;
    setPicked(option);
    if (option === question.answer) setScore((s) => s + 1);
    else setShake((s) => s + 1);
  };

  const next = () => {
    if (!answered) return;
    if (isLast) {
      setPhase("done");
      if (score > best) setBest(score);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  };

  // Tombol 1–4 untuk menjawab, Enter untuk lanjut.
  useEffect(() => {
    if (!inView || phase !== "play") return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const n = Number(e.key);
      if (n >= 1 && n <= order.length) pick(order[n - 1]);
      if (e.key === "Enter") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(id);
  }, [toast]);

  const download = async () => {
    const canvas = await drawResult(t, score);
    await downloadCanvas(canvas, `ranran-quiz-${score}of${TOTAL}.png`);
  };

  const share = async () => {
    const canvas = await drawResult(t, score);
    const text = t.shareText(score);
    if (await shareCanvas(canvas, `ranran-quiz-${score}of${TOTAL}.png`, text)) return;
    try {
      await navigator.clipboard.writeText(`${text} ${location.href}`);
      setToast(t.copied);
    } catch {}
  };

  const tier = tierFor(t, score);

  return (
    <section
      id="quiz"
      ref={ref}
      className="relative flex h-[100svh] w-full shrink-0 snap-start items-center justify-center overflow-hidden bg-black px-6"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div
              key="intro"
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <motion.p
                className="text-6xl"
                aria-hidden
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ☀️
              </motion.p>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-rose-300/80">
                {t.label}
              </p>
              <h2 className="mt-3 text-balance font-serif text-4xl font-black tracking-tight text-white sm:text-6xl">
                {t.title}
              </h2>
              <p className="mx-auto mt-4 max-w-md text-balance text-zinc-400">{t.intro}</p>
              <motion.button
                type="button"
                onClick={start}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-300 to-amber-200 px-7 py-3.5 text-sm font-bold text-black shadow-xl shadow-rose-500/25"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                {t.start} <ArrowRight className="size-4" />
              </motion.button>
              {best >= 0 && <p className="mt-4 text-xs text-zinc-500">{t.best(best)}</p>}
            </motion.div>
          )}

          {phase === "play" && (
            <motion.div
              key="play"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {/* Progres */}
              <div className="mb-6 flex items-center gap-4">
                <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  {t.question(index + 1, TOTAL)}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-200 to-rose-400"
                    animate={{ width: `${((index + (answered ? 1 : 0)) / TOTAL) * 100}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                </div>
                <span className="shrink-0 font-mono text-xs text-amber-200">☀ {score}</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md md:p-8"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.h3
                    key={`${index}-${shake}`}
                    className="text-balance font-serif text-2xl font-black text-white md:text-3xl"
                    animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : undefined}
                    transition={{ duration: 0.4 }}
                  >
                    {question.q[lang]}
                  </motion.h3>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {order.map((o, i) => {
                      const isAnswer = o === question.answer;
                      const isPicked = o === picked;
                      const state = !answered
                        ? "idle"
                        : isAnswer
                          ? "right"
                          : isPicked
                            ? "wrong"
                            : "dim";
                      return (
                        <motion.button
                          key={o}
                          type="button"
                          onClick={() => pick(o)}
                          disabled={answered}
                          className={`relative flex items-center gap-3 overflow-visible rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition-colors md:text-base ${
                            state === "right"
                              ? "border-emerald-400/60 bg-emerald-400/15 text-white"
                              : state === "wrong"
                                ? "border-rose-500/60 bg-rose-500/15 text-white"
                                : state === "dim"
                                  ? "border-white/5 text-zinc-600"
                                  : "border-white/10 bg-white/[0.03] text-zinc-200 hover:border-amber-200/50 hover:bg-white/[0.07]"
                          }`}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0, scale: state === "right" ? [1, 1.04, 1] : 1 }}
                          transition={{ delay: answered ? 0 : 0.05 * i }}
                          whileHover={!answered ? { y: -2 } : undefined}
                          whileTap={!answered ? { scale: 0.97 } : undefined}
                        >
                          <span
                            className={`grid size-7 shrink-0 place-items-center rounded-lg text-xs ${
                              state === "right"
                                ? "bg-emerald-400 text-black"
                                : state === "wrong"
                                  ? "bg-rose-500 text-white"
                                  : "bg-white/10 text-zinc-400"
                            }`}
                          >
                            {state === "right" ? (
                              <Check className="size-4" />
                            ) : state === "wrong" ? (
                              <X className="size-4" />
                            ) : (
                              i + 1
                            )}
                          </span>
                          {optionText(question.options[o], lang)}
                          {/* Matahari meletup saat jawaban benar dipilih */}
                          {state === "right" &&
                            isPicked &&
                            Array.from({ length: 8 }, (_, k) => {
                              const a = (k / 8) * Math.PI * 2;
                              return (
                                <motion.span
                                  key={k}
                                  aria-hidden
                                  className="pointer-events-none absolute left-1/2 top-1/2 text-lg"
                                  initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                                  animate={{ x: Math.cos(a) * 90, y: Math.sin(a) * 50, opacity: 0, scale: 1.2 }}
                                  transition={{ duration: 0.8, ease: "easeOut" }}
                                >
                                  ☀️
                                </motion.span>
                              );
                            })}
                        </motion.button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {answered && (
                      <motion.div
                        className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                      >
                        <div className="min-w-0 flex-1">
                          <p
                            className={`font-bold ${
                              picked === question.answer ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {picked === question.answer ? t.correct : t.wrong}
                          </p>
                          <p className="mt-1 text-sm text-zinc-400">{question.fact[lang]}</p>
                        </div>
                        <motion.button
                          type="button"
                          onClick={next}
                          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          autoFocus
                        >
                          {isLast ? t.finish : t.next} <ArrowRight className="size-4" />
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div
              key="done"
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-rose-300/80">
                {t.score}
              </p>
              <ScoreRing score={score} />
              <motion.h3
                className="mt-6 font-serif text-3xl font-black text-white md:text-5xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
              >
                {tier.title}
              </motion.h3>
              <p className="mt-3 max-w-md text-balance text-zinc-400">{tier.text}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={download}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-300 to-amber-200 px-5 py-2.5 text-sm font-bold text-black"
                >
                  <Download className="size-4" /> {t.download}
                </button>
                <button
                  type="button"
                  onClick={share}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:border-white/40"
                >
                  <Share2 className="size-4" /> {t.share}
                </button>
                <button
                  type="button"
                  onClick={start}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:border-white/40 hover:text-white"
                >
                  <RotateCcw className="size-4" /> {t.retry}
                </button>
              </div>
              <div className="mt-4 min-h-5 text-xs text-amber-200" aria-live="polite">
                {toast}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
