"use client";

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Heart, RotateCcw } from "lucide-react";
import { useLang } from "@/lib/i18n";

type Edition = {
  version: string;
  stage?: string;
  partner?: string;
};

const EDITIONS: Edition[] = [
  { version: "1.0" },
  { version: "2.0", stage: "Stage 2", partner: "Yuan YiQi" },
  { version: "3.0", stage: "Stage 2", partner: "Fei QinYuan" },
  { version: "4.0" },
];

function PartnerCard({
  edition,
  index,
  flipped,
  onFlip,
  show,
}: {
  edition: Edition;
  index: number;
  flipped: boolean;
  onFlip: () => void;
  show: boolean;
}) {
  // Kartu miring mengikuti posisi kursor.
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [12, -12]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-12, 12]), {
    stiffness: 200,
    damping: 20,
  });
  const shineX = useTransform(mx, (v) => `${v * 100}%`);
  const shineY = useTransform(my, (v) => `${v * 100}%`);
  const shine = useTransform(
    [shineX, shineY],
    ([sx, sy]) =>
      `radial-gradient(circle at ${sx} ${sy}, rgba(255,255,255,0.18), transparent 55%)`,
  );

  const { t: dict } = useLang();
  const t = dict.bestPartners;
  const joined = Boolean(edition.partner);
  const [hovering, setHovering] = useState(false);

  return (
    <motion.div
      className="aspect-[3/4] max-h-full w-full [perspective:1000px] md:aspect-[4/5]"
      initial={{ opacity: 0, y: 60 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ delay: 0.15 * index, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.button
        type="button"
        onClick={onFlip}
        aria-pressed={flipped}
        aria-label={t.aria(
          edition.version,
          joined ? t.ariaInfo(edition.stage!, edition.partner!) : null,
        )}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => {
          setHovering(false);
          mx.set(0.5);
          my.set(0.5);
        }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative block h-full w-full cursor-pointer rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
      >
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Depan */}
          <div
            className={`absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl border p-5 text-left md:p-6 ${
              joined
                ? "border-rose-300/30 bg-gradient-to-br from-rose-500/25 via-zinc-900 to-zinc-950"
                : "border-white/10 bg-zinc-900/80"
            }`}
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          >
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{ background: shine }}
              animate={{ opacity: hovering ? 1 : 0 }}
            />
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-400">
              {t.label}
            </p>
            <p
              className={`font-serif text-6xl font-black leading-none md:text-7xl ${
                joined ? "text-white" : "text-zinc-600"
              }`}
            >
              {edition.version}
            </p>
            <p className="flex items-center gap-2 text-xs text-zinc-500">
              <RotateCcw className="size-3.5" /> {t.clickToFlip}
            </p>
          </div>

          {/* Belakang */}
          <div
            className={`absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl border p-5 text-left md:p-6 ${
              joined
                ? "border-rose-300/40 bg-gradient-to-br from-rose-400 to-rose-700"
                : "border-white/10 bg-zinc-900"
            }`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70">
              {t.label} {edition.version}
            </p>
            {joined ? (
              <div>
                <p className="text-xs uppercase tracking-widest text-white/70">{t.result}</p>
                <p className="font-serif text-3xl font-black text-white md:text-4xl">
                  {edition.stage}
                </p>
                <p className="mt-4 text-xs uppercase tracking-widest text-white/70">
                  {t.partner}
                </p>
                <p className="flex items-center gap-2 text-xl font-bold text-white md:text-2xl">
                  <Heart className="size-5 fill-white" /> {edition.partner}
                </p>
              </div>
            ) : (
              <p className="font-serif text-2xl font-black text-zinc-500 md:text-3xl">
                {t.dnp}
              </p>
            )}
            <p className="text-xs text-white/60">
              {joined ? `Ranran × ${edition.partner}` : t.maybeNext}
            </p>
          </div>
        </motion.div>
      </motion.button>
    </motion.div>
  );
}

export default function BestPartnersSection() {
  const { t: dict } = useLang();
  const t = dict.bestPartners;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [flipped, setFlipped] = useState<boolean[]>(EDITIONS.map(() => false));
  const allFlipped = flipped.every(Boolean);

  return (
    <section
      id="best-partners"
      ref={ref}
      className="relative flex h-[100svh] w-full shrink-0 snap-start flex-col overflow-hidden bg-zinc-950"
    >
      <div className="pointer-events-none absolute -left-1/4 bottom-0 size-[60vmax] rounded-full bg-rose-600/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-10 pt-16 md:px-10 md:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
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
          <button
            type="button"
            onClick={() => setFlipped(EDITIONS.map(() => !allFlipped))}
            className="rounded-full border border-white/15 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-300 transition hover:border-rose-300/60 hover:text-white"
          >
            {allFlipped ? t.reset : t.flipAll}
          </button>
        </div>

        <div className="mt-8 grid min-h-0 flex-1 grid-cols-2 content-center items-center justify-items-center gap-4 md:mt-0 md:grid-cols-4 md:gap-6">
          {EDITIONS.map((edition, i) => (
            <PartnerCard
              key={edition.version}
              edition={edition}
              index={i}
              show={inView}
              flipped={flipped[i]}
              onFlip={() =>
                setFlipped((f) => f.map((v, j) => (j === i ? !v : v)))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
