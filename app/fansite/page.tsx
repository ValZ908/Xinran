"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import SectionNav from "@/components/section-nav";
import LanguageSwitcher from "@/components/language-switcher";
import ScrollHeroSection from "@/components/sections/scroll-hero-section";
import CatchphraseSection from "@/components/sections/catchphrase-section";
import TeamHistorySection from "@/components/sections/team-history-section";
import SenbatsuSection from "@/components/sections/senbatsu-section";
import BestPartnersSection from "@/components/sections/best-partners-section";
import GallerySection from "@/components/sections/gallery-section";
import GuestbookSection from "@/components/sections/guestbook-section";
import QuizSection from "@/components/sections/quiz-section";
import PhotocardSection from "@/components/sections/photocard-section";
import MusicPlayer from "@/components/music-player";
import SunnyEasterEgg from "@/components/sunny-easter-egg";
import { useLang } from "@/lib/i18n";

const SECTION_IDS = [
  "home",
  "catchphrase",
  "team-history",
  "senbatsu",
  "best-partners",
  "quiz",
  "gallery",
  "photocard",
  "guestbook",
] as const;

export default function Fansite() {
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useLang();
  const sections = useMemo(
    () => SECTION_IDS.map((id) => ({ id, label: t.nav[id] })),
    [t],
  );

  return (
    // Satu putaran scroll mouse = pindah satu layar penuh (scroll snap).
    <main
      ref={containerRef}
      className="h-[100svh] snap-y snap-mandatory overflow-y-scroll overflow-x-hidden scroll-smooth bg-black text-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ScrollHeroSection />
      <CatchphraseSection />
      <TeamHistorySection />
      <SenbatsuSection />
      <BestPartnersSection />
      <QuizSection />
      <GallerySection />
      <PhotocardSection />
      <GuestbookSection />
      <SectionNav sections={sections} containerRef={containerRef} />
      <LanguageSwitcher />
      <MusicPlayer />
      <SunnyEasterEgg />
      <Link
        href="/#games"
        className="fixed right-3 top-3 z-50 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md hover:bg-white/10 md:right-6 md:top-5"
      >
        🎮 Main Game
      </Link>
    </main>
  );
}
