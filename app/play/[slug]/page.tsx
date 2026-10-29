import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GAMES, getGame } from "@/lib/games";

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/play/[slug]">): Promise<Metadata> {
  const game = getGame((await params).slug);
  return game ? { title: game.title, description: game.description } : {};
}

export default async function PlayPage({ params }: PageProps<"/play/[slug]">) {
  const game = getGame((await params).slug);
  if (!game) notFound();

  return (
    <main className="flex h-[100svh] flex-col bg-black text-white">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-2">
        <Link href="/#games" className="rounded-full px-3 py-1 text-sm font-semibold hover:bg-white/10">
          ← Menu Game
        </Link>
        <h1 className="truncate text-sm font-bold">
          {game.emoji} {game.title}
        </h1>
        <a
          href={game.src}
          target="_blank"
          rel="noopener"
          className="rounded-full px-3 py-1 text-sm text-zinc-400 hover:bg-white/10 hover:text-white"
        >
          Layar penuh ↗
        </a>
      </header>
      {/* Game asli tetap jalan apa adanya di dalam iframe. */}
      <iframe src={game.src} title={game.title} className="w-full flex-1 border-0" allow="fullscreen; autoplay" />
    </main>
  );
}
