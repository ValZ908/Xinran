"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  // Melacak pergerakan kursor mouse
  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full h-[100svh] shrink-0 snap-start bg-black flex flex-col items-center justify-center overflow-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* LAYER 1: Teks Gelap Raksasa (Menyatu dengan background hitam) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none w-full h-full leading-none">
        <h1 className="text-[25vw] font-serif font-black text-zinc-950 select-none whitespace-nowrap m-0 p-0">
          SONG
        </h1>
        <h1 className="text-[25vw] font-serif font-black text-zinc-950 select-none whitespace-nowrap m-0 p-0">
          XINRAN
        </h1>
      </div>

      {/* LAYER 2: Teks Bersinar Raksasa (Spotlight) */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none w-full h-full leading-none"
        animate={{
          maskImage: `radial-gradient(circle ${
            isHovered ? "500px" : "0px"
          } at ${mousePosition.x}px ${mousePosition.y}px, black 0%, transparent 100%)`,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      >
        <h1 className="text-[25vw] font-serif font-black text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.8)] select-none whitespace-nowrap m-0 p-0">
          SONG
        </h1>
        <h1 className="text-[25vw] font-serif font-black text-rose-300 drop-shadow-[0_0_50px_rgba(244,63,94,0.8)] select-none whitespace-nowrap m-0 p-0">
          XINRAN
        </h1>
      </motion.div>

      {/* Petunjuk scroll */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-600">
        Scroll
        <motion.span
          className="block h-8 w-px bg-gradient-to-b from-rose-300 to-transparent"
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ originY: 0 }}
        />
      </div>
    </section>
  );
}