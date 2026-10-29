import Link from "next/link";
import { GAMES } from "@/lib/games";
import StickerSlapFooter from "@/components/ui/sticker-slap-footer";
import HeroSwitch from "@/components/hero-switch";
import ThemeToggle from "@/components/theme-toggle";
import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero";

export default function Portal() {
  return (
    <main className="min-h-[100svh] bg-black text-white transition-colors duration-500 pink:bg-pink-100 pink:text-rose-950">
      <ThemeToggle />
      {/* Hero */}
      <PerspectiveTunnelHero
        eyebrow="Song Xinran · SNH48"
        title={
          <span className="font-serif">
            Ranran
            <br />
            <span className="text-rose-300 pink:text-rose-500">Playground</span>
          </span>
        }
        subtitle="Satu tempat untuk semua hal tentang Ranran: fan site lengkap dan kumpulan mini game buatan ValZ."
        scrollLabel="Scroll untuk masuk"
      >
        <HeroSwitch />
      </PerspectiveTunnelHero>

      {/* Pilih game */}
      <section id="games" className="mx-auto max-w-6xl scroll-mt-8 px-4 pb-24 pt-12">
        <h2 className="text-2xl font-bold sm:text-3xl">Pilih Game</h2>
        <p className="mt-2 text-zinc-400 pink:text-rose-900/60">{GAMES.length} game siap dimainkan, langsung di browser.</p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((game) => (
            <Link
              key={game.slug}
              href={`/play/${game.slug}`}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 pink:border-rose-200 pink:bg-white/80 pink:shadow-sm transition hover:-translate-y-1 hover:border-rose-300/50"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-rose-900 via-zinc-900 to-indigo-950">
                {game.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={game.image}
                    alt=""
                    loading="lazy"
                    style={{ objectPosition: game.imagePosition }}
                    className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-6xl">{game.emoji}</span>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold backdrop-blur">
                  {game.emoji} {game.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold">{game.title}</h3>
                <p className="mt-1 text-sm text-zinc-400 pink:text-rose-900/60">{game.description}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-rose-300 group-hover:underline pink:text-rose-600">
                  Main →
                </span>
              </div>
            </Link>
          ))}

          <Link
            href="/fansite"
            className="group relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-3xl border border-rose-200/30 p-7 transition hover:-translate-y-1 hover:border-rose-200/70"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/games/ranran-gacha/images/white-rose.jpg"
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" aria-hidden />
            <div className="relative">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-rose-200">🌹 Fan Site</p>
              <h3 className="mt-3 font-serif text-3xl font-bold italic leading-tight">Song Xinran</h3>
              <div className="my-3 h-px w-12 bg-gradient-to-r from-rose-200 to-transparent" aria-hidden />
              <p className="text-sm text-zinc-300">
                Riwayat tim, Senbatsu, galeri, kuis, photocard maker, dan buku tamu.
              </p>
              <span className="mt-5 inline-block text-sm font-semibold tracking-wide text-rose-200 group-hover:underline">
                Buka Fan Site →
              </span>
            </div>
          </Link>
        </div>
      </section>

      <StickerSlapFooter
        wordmark="ranran"
        homeHref="/"
        navLabel="main"
        navHref="#games"
        jobsLabel="game favorit"
        jobs={GAMES.slice(0, 3).map((g) => ({ title: g.title.toLowerCase(), href: `/play/${g.slug}` }))}
        officeLabel="fan site"
        address={["riwayat tim & senbatsu", "galeri, kuis & photocard"]}
        mapLabel="Buka Fan Site"
        mapHref="/fansite"
        email=""
        chatHref=""
        socials={[]}
        stickers={[
          "heart",
          { kind: "bubble", text: "ranran" },
          "daisy",
          { kind: "burst", text: "snh" },
          "camera",
          "smiley",
        ]}
        credits={[
          { role: "dibuat oleh", name: "fans, untuk fans" },
          { role: "catatan", name: "semua game fan-made, cerita fiksi" },
        ]}
        paper="#fde7ee"
        panel="#9f1239"
        ink="#1a0b10"
        accent="#fb7185"
      />
    </main>
  );
}
