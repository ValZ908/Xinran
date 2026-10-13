"use client";

import { motion } from "framer-motion";
import { ChevronsDown } from "lucide-react";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { useLang } from "@/lib/i18n";
import { HERO_PHOTO } from "@/lib/photos";

export default function ScrollHeroSection() {
  const { t } = useLang();
  return (
    <section id="home" className="relative w-full shrink-0 snap-start bg-black">
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc={HERO_PHOTO}
        bgImageSrc={HERO_PHOTO}
        title="Song Xinran"
        date="SNH48"
        scrollToExpand={t.hero.scrollToExpand}
      />
      {/* Lewati animasi hero, langsung ke section berikutnya */}
      <motion.button
        type="button"
        onClick={() => document.getElementById("catchphrase")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-zinc-300 backdrop-blur-md transition-colors hover:border-rose-300/60 hover:text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        {t.hero.skip}
        <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
          <ChevronsDown className="size-3.5" />
        </motion.span>
      </motion.button>
    </section>
  );
}
