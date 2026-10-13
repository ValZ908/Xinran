"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Crown, Heart, Images, X } from "lucide-react";
import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";
import { useLang } from "@/lib/i18n";
import type { Dict } from "@/lib/dictionaries";
import { GALLERY } from "@/lib/photos";
import {
  likePhoto,
  loadCounts,
  loadLikedPhotos,
  saveLikedPhotos,
  subscribeCounts,
  type Counts,
} from "@/lib/photo-likes";

type T = Dict["lightbox"];

function LikeButton({
  count,
  liked,
  onLike,
  t,
  big,
}: {
  count: number;
  liked: boolean;
  onLike: () => void;
  t: T;
  big?: boolean;
}) {
  const [hearts, setHearts] = useState<number[]>([]);
  return (
    <span className="relative inline-flex">
      <motion.button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!liked) setHearts((h) => [...h, Date.now()]);
          onLike();
        }}
        aria-pressed={liked}
        aria-label={liked ? t.liked : t.like}
        title={liked ? t.liked : t.like}
        className={`flex items-center gap-1.5 rounded-full font-bold text-white backdrop-blur-md transition-colors ${
          big ? "bg-white/10 px-4 py-2 text-sm hover:bg-white/20" : "bg-black/50 px-2.5 py-1 text-xs hover:bg-black/70"
        }`}
        whileTap={{ scale: 0.85 }}
      >
        <Heart className={`${big ? "size-5" : "size-3.5"} ${liked ? "fill-rose-400 text-rose-400" : ""}`} />
        <span className="tabular-nums">{count}</span>
      </motion.button>
      {hearts.map((id, i) => (
        <motion.span
          key={id}
          aria-hidden
          className="pointer-events-none absolute left-1/3 top-0 text-rose-400"
          initial={{ y: 0, x: 0, opacity: 1, scale: 0.6 }}
          animate={{ y: -60, x: i % 2 ? 14 : -14, opacity: 0, scale: 1.6 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          onAnimationComplete={() => setHearts((h) => h.filter((x) => x !== id))}
        >
          <Heart className="size-5 fill-current" />
        </motion.span>
      ))}
    </span>
  );
}

function PhotoViewer({ onClose, t }: { onClose: () => void; t: T }) {
  const [view, setView] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const [counts, setCounts] = useState<Counts>({});
  const [liked, setLiked] = useState<Set<string>>(new Set());

  useEffect(() => {
    let alive = true;
    loadCounts()
      .then((c) => {
        if (!alive) return;
        setCounts(c);
        setLiked(loadLikedPhotos());
      })
      .catch(() => {});
    const unsub = subscribeCounts((id, likes) => setCounts((c) => ({ ...c, [id]: likes })));
    return () => {
      alive = false;
      unsub();
    };
  }, []);

  const like = (id: string) => {
    if (liked.has(id)) return;
    const next = new Set(liked).add(id);
    setLiked(next);
    saveLikedPhotos(next);
    setCounts((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
    likePhoto(id)
      .then((n) => {
        if (n !== null) setCounts((c) => ({ ...c, [id]: n }));
      })
      .catch(() => {});
  };

  // Foto dengan ❤ terbanyak dapat mahkota.
  const favorite = useMemo(() => {
    let best: string | null = null;
    for (const p of GALLERY) {
      if ((counts[p.id] ?? 0) > (best ? counts[best] : 0)) best = p.id;
    }
    return best;
  }, [counts]);

  const go = useCallback((step: number) => {
    setDir(step);
    setView((v) => (v === null ? v : (v + step + GALLERY.length) % GALLERY.length));
  }, []);

  // Keyboard. Fase capture supaya panah/spasi tidak ikut menggeser halaman di belakang.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (view !== null) setView(null);
        else onClose();
      } else if (view !== null && e.key === "ArrowRight") go(1);
      else if (view !== null && e.key === "ArrowLeft") go(-1);
      else if (!["ArrowUp", "ArrowDown", "PageUp", "PageDown", " "].includes(e.key)) return;
      e.stopImmediatePropagation();
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [view, go, onClose]);

  const photo = view !== null ? GALLERY[view] : null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
      className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-black/90 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Grid semua foto */}
      <div className="mx-auto max-w-6xl px-5 pb-16 md:px-10">
        <div className="sticky top-0 z-10 -mx-5 mb-4 flex items-center justify-between bg-gradient-to-b from-black via-black/85 to-transparent px-5 pb-6 pt-16 md:-mx-10 md:px-10 md:pt-8">
          <h2 className="font-serif text-3xl font-black text-white md:text-4xl">{t.title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="grid size-11 place-items-center rounded-full border border-white/15 text-white transition hover:border-white/40"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
          {GALLERY.map((p, i) => (
            <motion.div
              key={p.id}
              className="group relative mb-4 cursor-zoom-in break-inside-avoid overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
              whileHover={{ y: -4 }}
              onClick={() => {
                setDir(1);
                setView(i);
              }}
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={736}
                height={1104}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              {favorite === p.id && (
                <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-amber-300 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
                  <Crown className="size-3" /> {t.favorite}
                </span>
              )}
              <span className="absolute bottom-2 right-2">
                <LikeButton count={counts[p.id] ?? 0} liked={liked.has(p.id)} onLike={() => like(p.id)} t={t} />
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox satu foto */}
      <AnimatePresence>
        {photo && view !== null && (
          <motion.div
            className="fixed inset-0 z-10 flex flex-col bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setView(null)}
          >
            <div className="flex items-center justify-between px-5 pb-2 pt-16 text-sm text-zinc-400 md:px-8 md:pt-6">
              <span className="font-mono">{t.counter(view + 1, GALLERY.length)}</span>
              <button
                type="button"
                onClick={() => setView(null)}
                aria-label={t.close}
                className="grid size-11 place-items-center rounded-full border border-white/15 text-white transition hover:border-white/40"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={photo.id}
                  className="relative h-full w-full max-w-3xl cursor-grab active:cursor-grabbing"
                  initial={{ opacity: 0, x: dir * 120 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir * -120 }}
                  transition={{ type: "spring", stiffness: 300, damping: 32 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80) go(1);
                    else if (info.offset.x > 80) go(-1);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onDoubleClick={() => like(photo.id)}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 768px, 100vw"
                    className="pointer-events-none select-none object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label={t.prev}
                className="absolute left-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/40 text-white transition hover:border-white/40 md:grid"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label={t.next}
                className="absolute right-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/40 text-white transition hover:border-white/40 md:grid"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-3 px-5 pb-8 pt-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <LikeButton
                  count={counts[photo.id] ?? 0}
                  liked={liked.has(photo.id)}
                  onLike={() => like(photo.id)}
                  t={t}
                  big
                />
                {favorite === photo.id && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-300 px-3 py-1.5 text-xs font-bold text-black">
                    <Crown className="size-3.5" /> {t.favorite}
                  </span>
                )}
              </div>
              {/* Strip thumbnail */}
              <div className="flex max-w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                {GALLERY.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setDir(i > view ? 1 : -1);
                      setView(i);
                    }}
                    aria-label={p.alt}
                    aria-current={i === view}
                    className={`relative h-14 w-10 shrink-0 overflow-hidden rounded-md border-2 transition ${
                      i === view ? "border-rose-300" : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <Image src={p.src} alt="" fill sizes="40px" className="object-cover object-top" />
                  </button>
                ))}
              </div>
              <p className="hidden text-[11px] uppercase tracking-widest text-zinc-600 md:block">{t.hint}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function GallerySection() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <section id="gallery" className="h-[100svh] w-full shrink-0 snap-start bg-black">
      <TiltedGridHero
        images={GALLERY}
        // Foto-fotonya portrait, jadi tile-nya dibuat tegak (3:4).
        aspectRatio={3 / 4}
        tileHeight={52}
        axis={55}
        gap={8}
        speed={3}
        className="h-full w-full bg-black"
      >
        <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-between py-12 text-center">
          <div className="px-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose-300/80">
              {t.gallery.label}
            </p>
            <h2 className="text-balance font-serif text-4xl font-black tracking-tight text-white sm:text-5xl">
              {t.gallery.title}
            </h2>
          </div>
          <div className="flex flex-col items-center gap-4 px-6">
            <p className="max-w-md text-balance text-sm text-zinc-400">{t.gallery.desc}</p>
            <motion.button
              type="button"
              onClick={() => setOpen(true)}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-rose-300/60"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Images className="size-4" /> {t.lightbox.viewAll}
            </motion.button>
          </div>
        </div>
      </TiltedGridHero>

      <AnimatePresence>{open && <PhotoViewer onClose={close} t={t.lightbox} />}</AnimatePresence>
    </section>
  );
}
