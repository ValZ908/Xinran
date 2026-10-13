"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useLang } from "@/lib/i18n";
import { SUNNY_EVENT } from "@/components/sunny-easter-egg";

// Kalimat dipecah per bagian supaya muncul satu-satu dan bagian
// "sunny sunny" / 【冉冉升起】 bisa disorot.
const HANZI: { text: string; glow?: boolean }[] = [
  { text: "冉冉的天气预报：" },
  { text: "今天的天气" },
  { text: "sunny sunny", glow: true },
  { text: "因为小太阳" },
  { text: "【冉冉升起】", glow: true },
];

const PINYIN =
  "Rǎnrǎn de tiānqì yùbào: Jīntiān de tiānqì sunny sunny yīnwèi xiǎo tàiyáng [rǎnrǎn shēng qǐ]";

type Tab = "pinyin" | "meaning";

export default function CatchphraseSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const { t: dict } = useLang();
  const t = dict.catchphrase;
  const [lang, setLang] = useState<Tab>("meaning");
  const TRANSLATIONS: Record<Tab, string> = { pinyin: PINYIN, meaning: t.meaning };
  const TAB_LABEL: Record<Tab, string> = { pinyin: t.pinyinTab, meaning: t.meaningTab };
  const [sunshine, setSunshine] = useState(0);
  const [bursts, setBursts] = useState<number[]>([]);

  // Matahari sedikit mengikuti kursor.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 15 });
  const sy = useSpring(my, { stiffness: 60, damping: 15 });
  const sky = useTransform(
    sx,
    (v) =>
      `radial-gradient(ellipse 80% 60% at ${50 + v / 20}% 100%, rgba(251,146,60,0.7) 0%, rgba(244,63,94,0.35) 35%, transparent 70%)`,
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left - rect.width / 2) / 12);
    my.set((e.clientY - rect.top - rect.height / 2) / 16);
  };

  const shine = () => {
    setSunshine((n) => n + 1);
    // Klik ke-10 membuka easter egg.
    if (sunshine + 1 === 10) window.dispatchEvent(new Event(SUNNY_EVENT));
    setBursts((b) => [...b, Date.now()]);
  };

  // Makin sering diklik, makin terang langitnya (maksimal 10 klik).
  const warmth = Math.min(sunshine, 10) / 10;

  return (
    <section
      id="catchphrase"
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative flex h-[100svh] w-full shrink-0 snap-start items-center justify-center overflow-hidden bg-black"
    >
      {/* Langit fajar */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background: sky }}
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 0.55 + warmth * 0.45 : 0 }}
        transition={{ duration: 1.2 }}
      />

      {/* Matahari yang terbit */}
      <motion.div
        className="absolute bottom-0 left-1/2 z-0"
        style={{ x: sx, y: sy }}
      >
        <motion.button
          type="button"
          onClick={shine}
          aria-label={t.sunAria}
          className="relative block size-[46vmin] -translate-x-1/2 cursor-pointer rounded-full outline-none focus-visible:ring-4 focus-visible:ring-amber-200/60"
          initial={{ y: "85%" }}
          animate={{ y: inView ? "45%" : "85%" }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          {/* Sinar berputar */}
          <motion.span
            aria-hidden
            className="absolute -inset-[30%] rounded-full opacity-60"
            style={{
              background:
                "repeating-conic-gradient(from 0deg, rgba(253,224,71,0.35) 0deg 6deg, transparent 6deg 22deg)",
              maskImage:
                "radial-gradient(circle, transparent 38%, #000 42%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(circle, transparent 38%, #000 42%, transparent 70%)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-200 via-orange-400 to-rose-500 shadow-[0_0_120px_40px_rgba(251,146,60,0.45)]"
          />
          {/* Ledakan "sunny" setiap diklik */}
          {bursts.map((id) => (
            <motion.span
              key={id}
              aria-hidden
              className="absolute inset-0 rounded-full border-4 border-amber-200"
              initial={{ scale: 1, opacity: 0.9 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              onAnimationComplete={() =>
                setBursts((b) => b.filter((x) => x !== id))
              }
            />
          ))}
        </motion.button>
      </motion.div>

      {/* Garis cakrawala */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[18%] h-px bg-gradient-to-r from-transparent via-amber-200/40 to-transparent" />

      {/* Konten */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-[22vh] text-center">
        <motion.div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-100/80 backdrop-blur"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6 }}
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-300 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-amber-300" />
          </span>
          {t.badge}
        </motion.div>

        <h2 className="font-serif text-3xl font-black leading-tight text-white sm:text-5xl md:text-6xl">
          {HANZI.map((part, i) => (
            <motion.span
              key={part.text}
              className={
                part.glow
                  ? "inline-block bg-gradient-to-r from-amber-200 via-orange-300 to-rose-300 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(251,191,36,0.45)]"
                  : "inline-block"
              }
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={
                inView
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 30, filter: "blur(8px)" }
              }
              transition={{ duration: 0.7, delay: 0.25 + i * 0.18 }}
              whileHover={part.glow ? { scale: 1.08, rotate: -2 } : undefined}
            >
              {part.text}
            </motion.span>
          ))}
        </h2>

        {/* Pilihan Pinyin / English */}
        <motion.div
          className="mt-8 inline-flex rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ delay: 1.2 }}
          role="tablist"
        >
          {(["pinyin", "meaning"] as const).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={lang === key}
              onClick={() => setLang(key)}
              className="relative rounded-full px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-300 transition-colors hover:text-white"
            >
              {lang === key && (
                <motion.span
                  layoutId="lang-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/80 to-rose-400/80"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative">{TAB_LABEL[key]}</span>
            </button>
          ))}
        </motion.div>

        <div className="mt-5 min-h-[4.5rem] max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.p
              key={`${lang}-${TRANSLATIONS[lang]}`}
              className="text-balance text-base text-zinc-300 sm:text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: inView ? 1 : 0, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              {TRANSLATIONS[lang]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Penghitung sinar matahari */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-orange-950/80">
        <AnimatePresence mode="wait">
          <motion.span
            key={sunshine}
            className="block"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {sunshine === 0 ? t.clickSun : t.sunny(sunshine)}
          </motion.span>
        </AnimatePresence>
      </div>
    </section>
  );
}
