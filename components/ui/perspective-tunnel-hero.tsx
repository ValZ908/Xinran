"use client";

import {
  motion,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useScroll,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";

const G = "/games/ranran-gacha/images";
const IMAGES = [
  { src: `${G}/golden-stage.jpg`, title: "Golden Stage" },
  { src: `${G}/rose-silk.jpg`, title: "Rose Silk" },
  { src: `${G}/twin-tail.jpg`, title: "Twin Tail" },
  { src: `${G}/golden-wings.jpg`, title: "Golden Wings" },
  { src: `${G}/city-lights.jpg`, title: "City Lights" },
  { src: `${G}/airport.jpg`, title: "Airport" },
  { src: `${G}/campus-idol.jpg`, title: "Campus Idol" },
  { src: `${G}/white-rose.jpg`, title: "White Rose" },
  { src: "/images/gallery-1.jpg", title: "Ranran" },
];

interface TunnelCardData {
  item: { src: string; title: string };
  angleCos: number;
  angleSin: number;
  radiusFactorX: number;
  radiusFactorY: number;
  rotationZ: number;
  index: number;
}

const TUNNEL_CARDS: TunnelCardData[] = IMAGES.map((item, i) => {
  const goldenAngle = i * 137.5 * (Math.PI / 180);
  return {
    item,
    angleCos: Math.cos(goldenAngle),
    angleSin: Math.sin(goldenAngle),
    radiusFactorX: 0.28 + (i % 3) * 0.08,
    radiusFactorY: 0.26 + (i % 2) * 0.09,
    rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
    index: i,
  };
});

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

interface StageDimensions {
  width: number;
  height: number;
  isMobile: boolean;
}

// Ukuran layar lewat useSyncExternalStore: tidak perlu setState di effect.
const subscribeResize = (cb: () => void) => {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
};
const getSize = () => `${window.innerWidth}x${window.innerHeight}`;

function useCameraParallax(enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

interface TunnelCardProps {
  card: TunnelCardData;
  progress: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  total: number;
  stage: StageDimensions;
}

function TunnelCard({ card, progress, pointer, total, stage }: TunnelCardProps) {
  const staggerSpan = 0.55;
  const start = (card.index / total) * (1 - staggerSpan);
  const end = start + staggerSpan;

  const localProgress = useTransform(progress, [start, end], [0, 1]);

  const farZ = stage.isMobile ? -1200 : -1700;
  const nearZ = stage.isMobile ? 350 : 500;
  const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

  const opacity = useTransform(localProgress, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);
  // Kartu yang belum kelihatan jangan menangkap klik (bisa menutupi tombol di tengah).
  const pointerEvents = useTransform(opacity, (o) => (o > 0.05 ? "auto" : "none"));

  const cardWidth = stage.isMobile
    ? Math.max(130, Math.min(180, stage.width * 0.38))
    : Math.max(180, Math.min(270, stage.width * 0.18));

  const baseX = card.angleCos * (stage.width * card.radiusFactorX);
  const baseY = card.angleSin * (stage.height * card.radiusFactorY);
  const panStrength = stage.isMobile ? 20 : 45;

  const transform = useTransform([z, pointer.x, pointer.y], ([currZ, px, py]: number[]) => {
    const offsetX = baseX - px * panStrength;
    const offsetY = baseY - py * panStrength;
    return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`;
  });

  return (
    <motion.div
      style={{ width: cardWidth, transform, opacity, pointerEvents, zIndex: card.index + 1 }}
      className="absolute left-1/2 top-1/2 aspect-[4/5] cursor-pointer select-none will-change-transform"
    >
      <div className="group relative h-full w-full overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl shadow-black/90 ring-1 ring-white/15 transition-all duration-500 hover:shadow-rose-500/25 hover:ring-rose-300/70 pink:bg-pink-200 pink:shadow-rose-900/20 pink:ring-rose-300/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.item.src}
          alt={card.item.title}
          draggable={false}
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-4 sm:p-5">
          <span className="font-mono text-xs uppercase tracking-widest text-white/95 drop-shadow-md sm:text-sm">
            {card.item.title}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

interface PerspectiveTunnelHeroProps {
  eyebrow?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Konten yang bisa diklik di bawah judul (mis. tombol). */
  children?: ReactNode;
  scrollLabel?: string;
}

export default function PerspectiveTunnelHero({
  eyebrow = "Warp Drive Sequence",
  title = (
    <>
      INTO THE
      <br />
      ETHER.
    </>
  ),
  subtitle = "Scroll to fly through the spatial 3D corridor.",
  children,
  scrollLabel = "Scroll to Explore",
}: PerspectiveTunnelHeroProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const size = useSyncExternalStore(subscribeResize, getSize, () => "1440x900");
  const [width, height] = size.split("x").map(Number);
  const stage: StageDimensions = { width, height, isMobile: width < 768 };

  // Digerakkan scroll halaman: hero menempel selama trek 300svh, jadi scroll ke bawah
  // tetap jalan (asli memblokir wheel, sehingga halaman macet dan sentuh tidak jalan).
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 30, restDelta: 0.0001 });

  const pointer = useCameraParallax(!reduce);

  const titleScale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.12, 1.35]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.8, 0.97], [1, 1, 0]);
  const promptOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);

  return (
    <div ref={trackRef} className="relative h-[300svh]">
      <div
        className="sticky top-0 flex h-[100svh] w-full select-none items-center justify-center overflow-hidden"
        style={{ perspective: stage.isMobile ? "900px" : "1200px", transformStyle: "preserve-3d" }}
      >
        {/* Grid titik & cahaya */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#4c1d34_1px,transparent_1px)] opacity-65 [background-size:28px_28px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)] pink:bg-[radial-gradient(#f9a8d4_1px,transparent_1px)] pink:opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.18)_0%,transparent_75%)] pink:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.7)_0%,transparent_70%)]" />

        {/* Cincin kedalaman */}
        <div className="pointer-events-none absolute h-[48vmin] w-[48vmin] rounded-full border border-rose-400/15 pink:border-rose-400/30" />
        <div className="pointer-events-none absolute h-[76vmin] w-[76vmin] rounded-full border border-dashed border-white/10 pink:border-rose-300/50" />

        {/* Judul di tengah */}
        <motion.div
          style={{ scale: titleScale, opacity: titleOpacity }}
          className="pointer-events-none z-0 flex max-w-2xl flex-col items-center px-6 text-center"
        >
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-rose-300 pink:text-rose-500">{eyebrow}</p>
          <h1 className="text-5xl font-black leading-[0.9] tracking-tighter sm:text-7xl md:text-8xl">{title}</h1>
          <p className="mt-5 max-w-[40ch] text-sm font-light text-zinc-400 sm:text-base pink:text-rose-900/70">{subtitle}</p>
          {children && <div className="pointer-events-auto relative z-[60]">{children}</div>}
        </motion.div>

        {/* Ajakan scroll */}
        <motion.div
          style={{ opacity: promptOpacity }}
          className="pointer-events-none absolute bottom-8 z-20 flex flex-col items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-zinc-400 pink:text-rose-900/60"
        >
          <span>{scrollLabel}</span>
          <div className="h-6 w-px bg-gradient-to-b from-rose-400 to-transparent" />
        </motion.div>

        {/* Ruang 3D */}
        <div className="pointer-events-none absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {TUNNEL_CARDS.map((card, i) => (
            <TunnelCard
              key={i}
              card={card}
              progress={smoothProgress}
              pointer={pointer}
              total={TUNNEL_CARDS.length}
              stage={stage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
