"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Heart, PenLine, Send, X } from "lucide-react";
import { useLang } from "@/lib/i18n";
import type { Dict } from "@/lib/dictionaries";
import {
  GUESTBOOK_LIVE,
  MESSAGE_MAX,
  NAME_MAX,
  NOTE_COLORS,
  STICKERS,
  getGuestbook,
  loadLiked,
  saveLiked,
  type Note,
  type NoteColor,
} from "@/lib/guestbook";

const COOLDOWN = 30; // detik antar kiriman, biar tidak di-spam
const NAME_KEY = "xinran-guestbook-name";

type Draft = { name: string; message: string; color: NoteColor; sticker: string };
type T = Dict["guestbook"];

// Kemiringan tiap kertas tetap sama untuk pesan yang sama.
function tilt(id: string) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) | 0;
  return (Math.abs(h) % 7) - 3;
}

function ago(iso: string, now: number, locale: string) {
  const s = Math.round((Date.parse(iso) - now) / 1000);
  const abs = Math.abs(s);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (abs < 60) return rtf.format(0, "second");
  if (abs < 3600) return rtf.format(Math.round(s / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(s / 3600), "hour");
  if (abs < 86400 * 30) return rtf.format(Math.round(s / 86400), "day");
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(iso));
}

function merge(notes: Note[], note: Note) {
  const i = notes.findIndex((n) => n.id === note.id);
  if (i < 0) return [note, ...notes];
  const next = notes.slice();
  next[i] = note;
  return next;
}

/* ── Satu kertas di dinding ─────────────────────────────────── */

function NoteCard({
  note,
  time,
  liked,
  onLike,
  t,
}: {
  note: Note;
  time: string;
  liked: boolean;
  onLike: () => void;
  t: T;
}) {
  const [hearts, setHearts] = useState<number[]>([]);
  const [wiggle, setWiggle] = useState(0);
  const rotate = tilt(note.id);

  const click = () => {
    if (liked) {
      setWiggle((w) => w + 1);
      return;
    }
    setHearts((h) => [...h, Date.now()]);
    onLike();
  };

  return (
    <motion.article
      className={`relative mb-5 break-inside-avoid rounded-md p-4 pt-5 shadow-[0_14px_30px_-12px_rgba(0,0,0,0.7)] ${NOTE_COLORS[note.color].card}`}
      initial={{ opacity: 0, scale: 0.6, y: 30, rotate: rotate * 4 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotate }}
      whileHover={{ rotate: 0, scale: 1.04, y: -4, zIndex: 10 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {/* Selotip */}
      <span
        aria-hidden
        className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 -rotate-3 rounded-[2px] bg-white/45"
      />
      <span aria-hidden className="absolute right-3 top-2.5 text-2xl">
        {note.sticker}
      </span>
      <p className="whitespace-pre-wrap break-words pr-8 text-[15px] font-medium leading-snug">
        {note.message}
      </p>
      <footer className="mt-4 flex items-end justify-between gap-3 text-xs">
        <span className="min-w-0">
          <span className="block truncate font-bold">— {note.name}</span>
          <span className="opacity-60">{time}</span>
        </span>
        <span className="relative shrink-0">
          <motion.button
            key={wiggle}
            type="button"
            onClick={click}
            aria-pressed={liked}
            aria-label={liked ? t.liked : t.like}
            title={liked ? t.liked : t.like}
            className="flex items-center gap-1 rounded-full bg-black/10 px-2.5 py-1 font-bold transition-colors hover:bg-black/20"
            animate={wiggle ? { rotate: [0, -14, 14, -8, 0] } : undefined}
            whileTap={{ scale: 0.85 }}
          >
            <Heart className={`size-3.5 ${liked ? "fill-rose-600 text-rose-600" : ""}`} />
            <span className="tabular-nums">{note.likes}</span>
          </motion.button>
          {/* Hati beterbangan saat di-like */}
          {hearts.map((id, i) => (
            <motion.span
              key={id}
              aria-hidden
              className="pointer-events-none absolute left-2 top-0 text-rose-600"
              initial={{ y: 0, x: 0, opacity: 1, scale: 0.6 }}
              animate={{ y: -46, x: (i % 2 ? 1 : -1) * 14, opacity: 0, scale: 1.4 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              onAnimationComplete={() => setHearts((h) => h.filter((x) => x !== id))}
            >
              <Heart className="size-4 fill-current" />
            </motion.span>
          ))}
        </span>
      </footer>
    </motion.article>
  );
}

/* ── Form menulis: kertasnya sendiri adalah pratinjau ───────── */

function Composer({
  draft,
  setDraft,
  onSubmit,
  sending,
  cooldown,
  burst,
  status,
  t,
}: {
  draft: Draft;
  setDraft: (fn: (d: Draft) => Draft) => void;
  onSubmit: () => void;
  sending: boolean;
  cooldown: number;
  burst: number;
  status: "idle" | "sent" | "error";
  t: T;
}) {
  const uid = useId();
  const used = draft.message.length;
  const ratio = used / MESSAGE_MAX;
  const canSend = draft.message.trim().length > 0 && !sending && cooldown === 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSend) onSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <motion.div
        className={`relative rounded-md p-4 pt-5 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.8)] transition-colors duration-300 ${NOTE_COLORS[draft.color].card}`}
        initial={{ rotate: -2 }}
        animate={{ rotate: -1.5 }}
        whileHover={{ rotate: 0 }}
      >
        <span
          aria-hidden
          className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 rotate-2 rounded-[2px] bg-white/45"
        />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={draft.sticker}
            aria-hidden
            className="absolute right-3 top-2.5 text-3xl"
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
          >
            {draft.sticker}
          </motion.span>
        </AnimatePresence>

        <label htmlFor={`${uid}-msg`} className="sr-only">
          {t.message}
        </label>
        <textarea
          id={`${uid}-msg`}
          value={draft.message}
          maxLength={MESSAGE_MAX}
          rows={4}
          placeholder={t.messagePlaceholder}
          onChange={(e) => setDraft((d) => ({ ...d, message: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && canSend) onSubmit();
          }}
          className="w-full resize-none bg-transparent pr-10 text-[15px] font-medium leading-snug outline-none placeholder:text-current placeholder:opacity-45"
        />

        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="font-bold">—</span>
          <label htmlFor={`${uid}-name`} className="sr-only">
            {t.name}
          </label>
          <input
            id={`${uid}-name`}
            value={draft.name}
            maxLength={NAME_MAX}
            placeholder={t.namePlaceholder}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            className="min-w-0 flex-1 border-b border-current/20 bg-transparent py-0.5 font-bold outline-none placeholder:font-medium placeholder:opacity-45 focus:border-current/60"
          />
          {/* Sisa karakter */}
          <svg viewBox="0 0 20 20" className="size-5 shrink-0 -rotate-90" aria-hidden>
            <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth="2.5" />
            <circle
              cx="10"
              cy="10"
              r="8"
              fill="none"
              stroke={ratio > 0.9 ? "#e11d48" : "currentColor"}
              strokeWidth="2.5"
              strokeDasharray={`${Math.min(ratio, 1) * 50.27} 50.27`}
              strokeLinecap="round"
            />
          </svg>
          <span className={`w-7 text-right tabular-nums ${ratio > 0.9 ? "text-rose-700" : "opacity-60"}`}>
            {MESSAGE_MAX - used}
          </span>
        </div>

        {/* Stiker meletup saat terkirim */}
        {burst > 0 &&
          Array.from({ length: 10 }, (_, i) => {
            const angle = (i / 10) * Math.PI * 2;
            return (
              <motion.span
                key={`${burst}-${i}`}
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 text-2xl"
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
                animate={{
                  x: Math.cos(angle) * 150,
                  y: Math.sin(angle) * 110,
                  opacity: 0,
                  scale: 1.3,
                  rotate: i % 2 ? 90 : -90,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                {draft.sticker}
              </motion.span>
            );
          })}
      </motion.div>

      <fieldset>
        <legend className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
          {t.color}
        </legend>
        <div className="flex gap-2">
          {(Object.keys(NOTE_COLORS) as NoteColor[]).map((c) => (
            <motion.button
              key={c}
              type="button"
              aria-label={c}
              aria-pressed={draft.color === c}
              onClick={() => setDraft((d) => ({ ...d, color: c }))}
              className={`size-8 rounded-full border-2 transition ${
                draft.color === c ? "border-white" : "border-transparent opacity-70 hover:opacity-100"
              }`}
              style={{ background: NOTE_COLORS[c].swatch }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
          {t.sticker}
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {STICKERS.map((s) => (
            <motion.button
              key={s}
              type="button"
              aria-pressed={draft.sticker === s}
              onClick={() => setDraft((d) => ({ ...d, sticker: s }))}
              className={`grid size-9 place-items-center rounded-xl text-lg transition ${
                draft.sticker === s ? "bg-white/15 ring-1 ring-white/40" : "hover:bg-white/10"
              }`}
              whileHover={{ scale: 1.15, rotate: -8 }}
              whileTap={{ scale: 0.9 }}
            >
              {s}
            </motion.button>
          ))}
        </div>
      </fieldset>

      <motion.button
        type="submit"
        disabled={!canSend}
        className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-300 to-amber-200 px-5 py-3 text-sm font-bold text-black shadow-lg shadow-rose-500/20 transition disabled:cursor-not-allowed disabled:opacity-40"
        whileHover={canSend ? { scale: 1.02 } : undefined}
        whileTap={canSend ? { scale: 0.97 } : undefined}
      >
        <Send className="size-4" />
        {sending ? t.sending : t.send}
      </motion.button>

      <div className="min-h-5 text-center text-xs" aria-live="polite">
        <AnimatePresence mode="wait">
          {status === "sent" ? (
            <motion.p key="sent" className="text-amber-200" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {t.sent}
            </motion.p>
          ) : status === "error" ? (
            <motion.p key="err" className="text-rose-400" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {t.error}
            </motion.p>
          ) : cooldown > 0 ? (
            <motion.p key="cd" className="text-zinc-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {t.cooldown(cooldown)}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  );
}

/* ── Section ────────────────────────────────────────────────── */

export default function GuestbookSection() {
  const { t: dict, locale } = useLang();
  const t = dict.guestbook;
  const ref = useRef<HTMLElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });

  const [notes, setNotes] = useState<Note[]>([]);
  const [load, setLoad] = useState<"loading" | "ready" | "error">("loading");
  const [reload, setReload] = useState(0);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [now, setNow] = useState(0);
  const [sort, setSort] = useState<"new" | "loved">("new");
  const [draft, setDraftState] = useState<Draft>({
    name: "",
    message: "",
    color: "sun",
    sticker: STICKERS[0],
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [cooldown, setCooldown] = useState(0);
  const [burst, setBurst] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  const setDraft = useCallback((fn: (d: Draft) => Draft) => setDraftState(fn), []);
  const upsert = useCallback((note: Note) => setNotes((prev) => merge(prev, note)), []);

  // Muat pesan + dengarkan pesan baru dari pengunjung lain.
  useEffect(() => {
    const gb = getGuestbook();
    let alive = true;
    gb.list()
      .then((list) => {
        if (!alive) return;
        setNotes(list);
        setLoad("ready");
        setLiked(loadLiked());
        setNow(Date.now());
        let savedName = "";
        try {
          savedName = localStorage.getItem(NAME_KEY) ?? "";
        } catch {}
        setDraftState((d) => (d.name ? d : { ...d, name: savedName }));
      })
      .catch(() => alive && setLoad("error"));
    const unsubscribe = gb.subscribe(upsert);
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => {
      alive = false;
      unsubscribe();
      clearInterval(timer);
    };
  }, [reload, upsert]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  useEffect(() => {
    if (status === "idle") return;
    const id = setTimeout(() => setStatus("idle"), 3500);
    return () => clearTimeout(id);
  }, [status]);

  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen]);

  const submit = async () => {
    const message = draft.message.trim();
    if (!message || sending || cooldown > 0) return;
    const name = draft.name.trim() || t.anonymous;
    setSending(true);
    try {
      const note = await getGuestbook().add({
        name: name.slice(0, NAME_MAX),
        message: message.slice(0, MESSAGE_MAX),
        color: draft.color,
        sticker: draft.sticker,
      });
      upsert(note);
      setNow(Date.now());
      setSort("new");
      setBurst((b) => b + 1);
      setStatus("sent");
      setCooldown(COOLDOWN);
      setDraftState((d) => ({ ...d, message: "" }));
      try {
        localStorage.setItem(NAME_KEY, draft.name.trim());
      } catch {}
      boardRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setSheetOpen(false), 900);
    } catch {
      setStatus("error");
    } finally {
      setSending(false);
    }
  };

  const like = async (id: string) => {
    if (liked.has(id)) return;
    const next = new Set(liked).add(id);
    setLiked(next);
    saveLiked(next);
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, likes: n.likes + 1 } : n)));
    try {
      const count = await getGuestbook().like(id);
      if (count !== null)
        setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, likes: count } : n)));
    } catch {}
  };

  const sorted = useMemo(
    () =>
      [...notes].sort((a, b) =>
        sort === "loved" && b.likes !== a.likes
          ? b.likes - a.likes
          : Date.parse(b.created_at) - Date.parse(a.created_at),
      ),
    [notes, sort],
  );

  const composer = (
    <Composer
      draft={draft}
      setDraft={setDraft}
      onSubmit={submit}
      sending={sending}
      cooldown={cooldown}
      burst={burst}
      status={status}
      t={t}
    />
  );

  return (
    <section
      id="guestbook"
      ref={ref}
      className="relative flex h-[100svh] w-full shrink-0 snap-start flex-col overflow-hidden bg-zinc-950"
    >
      <div className="pointer-events-none absolute -right-1/4 -top-1/4 size-[60vmax] rounded-full bg-amber-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-1/3 -left-1/4 size-[50vmax] rounded-full bg-rose-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-6 pb-8 pt-16 md:px-10 md:pt-20">
        {/* Judul + kontrol */}
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
            <p className="mt-2 hidden max-w-md text-sm text-zinc-400 sm:block">{t.subtitle}</p>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ delay: 0.2 }}
          >
            <span
              className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-400"
              title={GUESTBOOK_LIVE ? undefined : t.demo}
            >
              <span className="relative flex size-2">
                {GUESTBOOK_LIVE && (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex size-2 rounded-full ${
                    GUESTBOOK_LIVE ? "bg-emerald-400" : "bg-amber-300"
                  }`}
                />
              </span>
              {GUESTBOOK_LIVE ? t.live : "Demo"} · {t.notes(notes.length)}
            </span>
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1" role="tablist">
              {(["new", "loved"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={sort === key}
                  onClick={() => setSort(key)}
                  className="relative rounded-full px-4 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:text-white"
                >
                  {sort === key && (
                    <motion.span
                      layoutId="guestbook-sort"
                      className="absolute inset-0 rounded-full bg-white/15"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative">{key === "new" ? t.newest : t.loved}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-6 grid min-h-0 flex-1 gap-6 md:grid-cols-[300px_minmax(0,1fr)] lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Form (desktop) */}
          <motion.aside
            className="hidden min-h-0 overflow-y-auto overflow-x-hidden px-1 pt-3 md:block [scrollbar-width:thin]"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ delay: 0.15 }}
          >
            {composer}
          </motion.aside>

          {/* Dinding pesan */}
          <div
            ref={boardRef}
            className="relative min-h-0 overflow-y-auto rounded-3xl border border-white/10 bg-white/[0.02] bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] p-4 pt-6 [background-size:18px_18px] [scrollbar-width:thin] md:p-6 md:pt-8"
          >
            {load === "loading" && (
              <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    className="mb-5 h-32 break-inside-avoid animate-pulse rounded-md bg-white/5"
                    style={{ height: 96 + (i % 3) * 32 }}
                  />
                ))}
              </div>
            )}

            {load === "error" && (
              <div className="grid h-full place-items-center text-center text-sm text-zinc-400">
                <div>
                  <p>{t.loadError}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setLoad("loading");
                      setReload((r) => r + 1);
                    }}
                    className="mt-3 rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold text-white hover:border-white/40"
                  >
                    {t.retry}
                  </button>
                </div>
              </div>
            )}

            {load === "ready" && sorted.length === 0 && (
              <div className="grid h-full min-h-48 place-items-center text-center">
                <div>
                  <motion.p
                    className="text-5xl"
                    animate={{ rotate: [0, 12, -12, 0], y: [0, -6, 0] }}
                    transition={{ duration: 2.6, repeat: Infinity }}
                    aria-hidden
                  >
                    ☀️
                  </motion.p>
                  <p className="mt-4 text-sm text-zinc-400">{t.empty}</p>
                </div>
              </div>
            )}

            {load === "ready" && sorted.length > 0 && (
              <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
                {sorted.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    time={now ? ago(note.created_at, now, locale) : ""}
                    liked={liked.has(note.id)}
                    onLike={() => like(note.id)}
                    t={t}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {!GUESTBOOK_LIVE && (
          <p className="mt-3 text-center text-[11px] text-zinc-600">{t.demo}</p>
        )}
      </div>

      {/* Tombol & lembar form (HP) */}
      <motion.button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-gradient-to-r from-rose-300 to-amber-200 px-5 py-3 text-sm font-bold text-black shadow-xl shadow-rose-500/30 md:hidden"
        whileTap={{ scale: 0.95 }}
      >
        <PenLine className="size-4" />
        {t.write}
      </motion.button>

      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end bg-black/70 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSheetOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t.write}
              className="max-h-[90svh] w-full overflow-y-auto rounded-t-3xl border-t border-white/10 bg-zinc-900 px-5 pb-6 pt-4"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="font-serif text-xl font-black text-white">{t.write}</p>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  aria-label={t.close}
                  className="grid size-9 place-items-center rounded-full border border-white/10 text-zinc-300"
                >
                  <X className="size-4" />
                </button>
              </div>
              {composer}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
