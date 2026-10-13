"use client";

import { useSyncExternalStore } from "react";
import { dictionaries } from "@/lib/dictionaries";

export type Lang = keyof typeof dictionaries;

export const LANGS: { code: Lang; short: string; label: string; locale: string }[] = [
  { code: "id", short: "ID", label: "Bahasa Indonesia", locale: "id-ID" },
  { code: "en", short: "EN", label: "English", locale: "en-US" },
  { code: "zh", short: "中", label: "中文", locale: "zh-CN" },
];

const KEY = "xinran-lang";
const EVENT = "xinran-lang-change";

// Cadangan kalau localStorage diblokir (mode private, dsb.).
let memory: Lang | null = null;

const isLang = (v: unknown): v is Lang =>
  typeof v === "string" && v in dictionaries;

function read(): Lang {
  if (memory) return memory;
  try {
    const saved = localStorage.getItem(KEY);
    if (isLang(saved)) return saved;
  } catch {}
  // Kunjungan pertama: ikuti bahasa browser.
  const nav = navigator.language.toLowerCase();
  if (nav.startsWith("zh")) return "zh";
  if (nav.startsWith("id") || nav.startsWith("ms")) return "id";
  return "en";
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function setLang(lang: Lang) {
  memory = lang;
  try {
    localStorage.setItem(KEY, lang);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function useLang() {
  // Server selalu render bahasa Inggris, lalu browser beralih ke pilihan pengguna.
  const lang = useSyncExternalStore(subscribe, read, () => "en" as Lang);
  const locale = LANGS.find((l) => l.code === lang)!.locale;
  return { lang, locale, t: dictionaries[lang] };
}
