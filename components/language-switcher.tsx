"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Languages } from "lucide-react";
import { LANGS, setLang, useLang } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { lang, locale, t } = useLang();

  // Atribut lang di <html> ikut berganti (untuk pembaca layar & font CJK).
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <div
      role="radiogroup"
      aria-label={t.langSwitcher}
      className="fixed left-3 top-3 z-50 flex items-center gap-1 rounded-full border border-white/10 bg-black/50 p-1 pl-2.5 text-white shadow-lg backdrop-blur-md md:left-6 md:top-5"
    >
      <Languages aria-hidden className="mr-0.5 size-3.5 text-rose-300" />
      {LANGS.map((l) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={l.label}
            title={l.label}
            onClick={() => setLang(l.code)}
            className={`relative min-w-9 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wider transition-colors ${
              active ? "text-black" : "text-zinc-400 hover:text-white"
            }`}
          >
            {active && (
              <motion.span
                layoutId="global-lang-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-300 to-amber-200"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative">{l.short}</span>
          </button>
        );
      })}
    </div>
  );
}
