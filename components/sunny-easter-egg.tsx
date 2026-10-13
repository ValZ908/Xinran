"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

// Easter egg: ketik "sunny" di mana saja (di luar kolom teks), atau klik
// matahari di section Catchphrase 10×, lalu matahari kecil Ranran terbit.
const SECRET = "sunny";
export const SUNNY_EVENT = "xinran-sunny";

// Posisi emoji yang jatuh: tetap, supaya render tidak bergantung Math.random.
const DROPS = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: (i % 7) * 0.18,
  duration: 2.4 + (i % 5) * 0.35,
  size: 18 + (i % 4) * 8,
  emoji: ["☀️", "🌤️", "✨", "🌸"][i % 4],
}));

export default function SunnyEasterEgg() {
  const { t } = useLang();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.key.length !== 1) return;
      typed = (typed + e.key.toLowerCase()).slice(-SECRET.length);
      if (typed === SECRET) {
        typed = "";
        setShown(Date.now());
      }
    };
    const onSunny = () => setShown(Date.now());
    window.addEventListener("keydown", onKey);
    window.addEventListener(SUNNY_EVENT, onSunny);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(SUNNY_EVENT, onSunny);
    };
  }, []);

  useEffect(() => {
    if (!shown) return;
    const id = setTimeout(() => setShown(0), 4800);
    return () => clearTimeout(id);
  }, [shown]);

  return (
    <AnimatePresence>
      {shown > 0 && (
        <motion.div
          key={shown}
          className="fixed inset-0 z-[80] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => setShown(0)}
          role="status"
          aria-live="polite"
        >
          {/* Langit fajar */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(251,146,60,0.75),rgba(244,63,94,0.35)_40%,rgba(0,0,0,0.75)_75%)]" />

          {/* Hujan matahari */}
          {DROPS.map((d, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute top-0"
              style={{ left: `${d.left}%`, fontSize: d.size }}
              initial={{ y: "-10vh", rotate: 0, opacity: 0 }}
              animate={{ y: "110vh", rotate: 360, opacity: [0, 1, 1, 0] }}
              transition={{ duration: d.duration, delay: d.delay, ease: "easeIn" }}
            >
              {d.emoji}
            </motion.span>
          ))}

          {/* Matahari yang terbit */}
          <motion.div
            className="absolute bottom-0 left-1/2 size-[60vmin] -translate-x-1/2"
            initial={{ y: "100%" }}
            animate={{ y: "35%" }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              aria-hidden
              className="absolute -inset-[35%] rounded-full opacity-70"
              style={{
                background:
                  "repeating-conic-gradient(from 0deg, rgba(253,224,71,0.45) 0deg 6deg, transparent 6deg 20deg)",
                maskImage: "radial-gradient(circle, transparent 36%, #000 40%, transparent 70%)",
                WebkitMaskImage: "radial-gradient(circle, transparent 36%, #000 40%, transparent 70%)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            />
            <span className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-200 via-orange-400 to-rose-500 shadow-[0_0_160px_60px_rgba(251,146,60,0.55)]" />
          </motion.div>

          {/* Teks */}
          <motion.div
            className="absolute inset-x-0 top-[28%] px-6 text-center"
            initial={{ opacity: 0, scale: 0.6, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 14 }}
          >
            <p className="bg-gradient-to-r from-amber-100 via-amber-200 to-rose-200 bg-clip-text font-serif text-6xl font-black text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.6)] md:text-8xl">
              {t.easter.title}
            </p>
            <p className="mt-4 text-lg font-semibold text-white/90">{t.easter.text}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
