"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Download, Share2 } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { CARD_PHOTOS } from "@/lib/photos";
import { downloadCanvas, drawCover, loadImage, shareCanvas, wrapText } from "@/lib/canvas";

type Frame = "polaroid" | "idol" | "sunny" | "night";

const FRAMES: { id: Frame; chip: string }[] = [
  { id: "polaroid", chip: "linear-gradient(135deg,#f5f0e8,#e7e0d4)" },
  { id: "idol", chip: "linear-gradient(135deg,#fda4af,#c4b5fd,#7dd3fc,#fde68a)" },
  { id: "sunny", chip: "linear-gradient(135deg,#fde68a,#fb923c,#fb7185)" },
  { id: "night", chip: "linear-gradient(135deg,#18181b,#4c0519)" },
];

const W = 900;
const H = 1350;
const CAPTION_MAX = 40;
const FROM_MAX = 20;

const HAND = "'Segoe Print', 'Bradley Hand', 'Comic Sans MS', cursive";
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "system-ui, -apple-system, 'Segoe UI', sans-serif";

type Card = { photo: string; frame: Frame; caption: string; from: string; date: string };

async function drawCard(canvas: HTMLCanvasElement, card: Card, fromLabel: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const img = await loadImage(card.photo);
  ctx.reset?.();
  ctx.clearRect(0, 0, W, H);
  ctx.textBaseline = "alphabetic";
  const signature = [card.from && `${fromLabel} ${card.from}`, card.date].filter(Boolean).join(" · ");

  if (card.frame === "polaroid") {
    ctx.fillStyle = "#f5f0e8";
    ctx.fillRect(0, 0, W, H);
    drawCover(ctx, img, 60, 60, W - 120, 1000);
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, W - 120, 1000);
    ctx.fillStyle = "#3f3f46";
    ctx.textAlign = "center";
    ctx.font = `600 58px ${HAND}`;
    wrapText(ctx, card.caption, W / 2, 1150, W - 160, 64, 2);
    ctx.font = `400 26px ${HAND}`;
    ctx.fillStyle = "#71717a";
    ctx.textAlign = "right";
    ctx.fillText(signature, W - 70, H - 40);
    return;
  }

  if (card.frame === "idol") {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 56);
    ctx.clip();
    drawCover(ctx, img, 0, 0, W, H, 0.2);
    const fade = ctx.createLinearGradient(0, H * 0.55, 0, H);
    fade.addColorStop(0, "rgba(0,0,0,0)");
    fade.addColorStop(1, "rgba(0,0,0,0.85)");
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    const holo = ctx.createLinearGradient(0, 0, W, H);
    ["#fda4af", "#c4b5fd", "#7dd3fc", "#a7f3d0", "#fde68a"].forEach((c, i, a) =>
      holo.addColorStop(i / (a.length - 1), c),
    );
    ctx.strokeStyle = holo;
    ctx.lineWidth = 28;
    ctx.beginPath();
    ctx.roundRect(14, 14, W - 28, H - 28, 46);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.font = `700 26px ${SANS}`;
    ctx.fillText("SNH48 · TEAM HII", 70, 100);
    ctx.font = "60px serif";
    ctx.textAlign = "right";
    ctx.fillText("☀️", W - 70, 115);

    ctx.textAlign = "left";
    ctx.font = `900 92px ${SERIF}`;
    ctx.fillText("SONG XINRAN", 70, H - 230);
    ctx.fillStyle = "#fecdd3";
    ctx.font = `600 40px ${SANS}`;
    wrapText(ctx, card.caption, 70, H - 160, W - 140, 48, 2);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = `500 24px ${SANS}`;
    ctx.fillText(signature, 70, H - 62);
    return;
  }

  if (card.frame === "sunny") {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#fde68a");
    bg.addColorStop(0.55, "#fb923c");
    bg.addColorStop(1, "#fb7185");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    // Sinar matahari di belakang foto
    ctx.save();
    ctx.translate(W / 2, 520);
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    for (let i = 0; i < 16; i++) {
      ctx.rotate((Math.PI * 2) / 16);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-60, -1100);
      ctx.lineTo(60, -1100);
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.shadowColor = "rgba(124,45,18,0.35)";
    ctx.shadowBlur = 40;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(70, 70, W - 140, 960, 40);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(86, 86, W - 172, 928, 30);
    ctx.clip();
    drawCover(ctx, img, 86, 86, W - 172, 928);
    ctx.restore();

    ctx.font = "84px serif";
    ctx.textAlign = "center";
    ctx.fillText("☀️", 110, 140);
    ctx.font = "60px serif";
    ctx.fillText("🌤️", W - 100, 1010);

    ctx.fillStyle = "#431407";
    ctx.font = `900 60px ${SERIF}`;
    wrapText(ctx, card.caption, W / 2, 1130, W - 140, 66, 2);
    ctx.fillStyle = "rgba(67,20,7,0.7)";
    ctx.font = `600 26px ${SANS}`;
    ctx.fillText(signature || "Song Xinran", W / 2, H - 48);
    return;
  }

  // night
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, 560, 50, W / 2, 560, 700);
  glow.addColorStop(0, "rgba(244,63,94,0.25)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 60; i++) {
    // Bintang dengan posisi tetap (pseudo-acak dari indeks)
    const x = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const y = (Math.sin(i * 78.233) * 12345.6789) % 1;
    ctx.fillStyle = `rgba(255,255,255,${0.2 + (i % 5) * 0.12})`;
    ctx.beginPath();
    ctx.arc(Math.abs(x) * W, Math.abs(y) * H, 1 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(90, 90, W - 180, 960, 28);
  ctx.clip();
  drawCover(ctx, img, 90, 90, W - 180, 960);
  ctx.restore();
  ctx.save();
  ctx.shadowColor = "#fb7185";
  ctx.shadowBlur = 36;
  ctx.strokeStyle = "#fda4af";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(90, 90, W - 180, 960, 28);
  ctx.stroke();
  ctx.restore();

  ctx.textAlign = "center";
  ctx.fillStyle = "#fda4af";
  ctx.font = `italic 700 58px ${SERIF}`;
  wrapText(ctx, card.caption, W / 2, 1150, W - 160, 64, 2);
  ctx.fillStyle = "#71717a";
  ctx.font = `500 24px ${SANS}`;
  ctx.fillText(signature || "SONG XINRAN", W / 2, H - 48);
}

export default function PhotocardSection() {
  const { t: dict, locale } = useLang();
  const t = dict.photocard;
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const uid = useId();

  const [photo, setPhoto] = useState(CARD_PHOTOS[0].src);
  const [frame, setFrame] = useState<Frame>("idol");
  const [caption, setCaption] = useState("");
  const [from, setFrom] = useState("");
  const [showDate, setShowDate] = useState(true);

  const card = (): Card => ({
    photo,
    frame,
    caption: caption.trim() || t.captionPlaceholder,
    from: from.trim(),
    date: showDate ? new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date()) : "",
  });

  // Gambar ulang setiap ada perubahan.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) drawCard(canvas, card(), t.from).catch(() => {});
  });

  const download = () => {
    if (canvasRef.current) downloadCanvas(canvasRef.current, `ranran-photocard-${frame}.png`);
  };

  const share = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!(await shareCanvas(canvas, `ranran-photocard-${frame}.png`, "Song Xinran ☀"))) download();
  };

  const labelCls = "mb-2 block text-[11px] font-semibold uppercase tracking-widest text-zinc-500";
  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-rose-300/60";

  return (
    <section
      id="photocard"
      ref={ref}
      className="relative flex h-[100svh] w-full shrink-0 snap-start flex-col overflow-hidden bg-zinc-950"
    >
      <div className="pointer-events-none absolute -left-1/4 top-1/4 size-[55vmax] rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-6 pb-6 pt-16 md:px-10 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-300/80">{t.label}</p>
          <h2 className="mt-3 font-serif text-3xl font-black tracking-tight text-white sm:text-5xl">
            {t.title}
          </h2>
          <p className="mt-2 hidden text-sm text-zinc-400 sm:block">{t.subtitle}</p>
        </motion.div>

        <div className="mt-5 grid min-h-0 flex-1 grid-rows-[minmax(0,42%)_minmax(0,1fr)] gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:grid-rows-1 md:gap-10">
          {/* Pratinjau */}
          <motion.div
            className="flex min-h-0 items-center justify-center"
            initial={{ opacity: 0, rotate: -6, scale: 0.9 }}
            animate={inView ? { opacity: 1, rotate: -2, scale: 1 } : { opacity: 0, rotate: -6, scale: 0.9 }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
          >
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              role="img"
              aria-label={t.preview}
              className="h-full max-h-full w-auto max-w-full rounded-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]"
            />
          </motion.div>

          {/* Kontrol */}
          <motion.div
            className="flex min-h-0 flex-col gap-4 overflow-y-auto pb-2 pr-1 [scrollbar-width:thin]"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ delay: 0.15 }}
          >
            <fieldset>
              <legend className={labelCls}>{t.photo}</legend>
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
                {CARD_PHOTOS.map((p) => (
                  <motion.button
                    key={p.id}
                    type="button"
                    onClick={() => setPhoto(p.src)}
                    aria-label={p.alt}
                    aria-pressed={photo === p.src}
                    className={`relative h-20 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      photo === p.src ? "border-rose-300" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                    whileTap={{ scale: 0.92 }}
                  >
                    <Image src={p.src} alt="" fill sizes="56px" className="object-cover object-top" />
                  </motion.button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className={labelCls}>{t.frame}</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {FRAMES.map((f) => (
                  <motion.button
                    key={f.id}
                    type="button"
                    onClick={() => setFrame(f.id)}
                    aria-pressed={frame === f.id}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                      frame === f.id
                        ? "border-rose-300/70 bg-rose-300/10 text-white"
                        : "border-white/10 text-zinc-400 hover:border-white/30 hover:text-white"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="size-4 shrink-0 rounded-full border border-white/20" style={{ background: f.chip }} />
                    {t.frames[f.id]}
                  </motion.button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${uid}-cap`} className={labelCls}>
                  {t.caption}
                </label>
                <input
                  id={`${uid}-cap`}
                  value={caption}
                  maxLength={CAPTION_MAX}
                  placeholder={t.captionPlaceholder}
                  onChange={(e) => setCaption(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor={`${uid}-from`} className={labelCls}>
                  {t.from}
                </label>
                <input
                  id={`${uid}-from`}
                  value={from}
                  maxLength={FROM_MAX}
                  placeholder={t.fromPlaceholder}
                  onChange={(e) => setFrom(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={showDate}
                onChange={(e) => setShowDate(e.target.checked)}
                className="size-4 accent-rose-300"
              />
              {t.date}
            </label>

            <div className="mt-auto flex flex-wrap gap-3 pt-2">
              <motion.button
                type="button"
                onClick={download}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-300 to-amber-200 px-6 py-3 text-sm font-bold text-black shadow-lg shadow-rose-500/20"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
              >
                <Download className="size-4" /> {t.download}
              </motion.button>
              <motion.button
                type="button"
                onClick={share}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:border-white/40"
                whileTap={{ scale: 0.96 }}
              >
                <Share2 className="size-4" /> {t.share}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
