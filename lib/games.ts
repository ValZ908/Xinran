// Daftar game di portal. Mau nambah game baru? Taruh file-nya di
// public/games/<nama-folder>/ lalu tambahkan satu entri di sini.

export type Game = {
  slug: string;
  title: string;
  description: string;
  /** Halaman awal game, relatif ke /public. */
  src: string;
  /** Gambar kartu. Kosongkan untuk pakai gradasi + emoji. */
  image?: string;
  /** Titik fokus foto (CSS object-position) supaya wajah pas di tengah kartu. Default: atas. */
  imagePosition?: string;
  emoji: string;
  tag: string;
};

export const GAMES: Game[] = [
  {
    slug: "gacha",
    title: "Photocard Gacha",
    description: "Tarik kartu dan kumpulkan semua photocard Ranran. Bisa dapat SSR hologram!",
    src: "/games/ranran-gacha/index.html",
    image: "/games/ranran-gacha/images/golden-stage.jpg",
    imagePosition: "50% 12%",
    emoji: "🃏",
    tag: "Koleksi",
  },
  {
    slug: "sekolah",
    title: "Ranran Sekolah",
    description: "Game pixel art: lima hari jadi teman sekelas Ranran, dengan beberapa ending.",
    src: "/games/ranran-sekolah/index.html",
    emoji: "🏫",
    tag: "Cerita",
  },
  {
    slug: "fanmeet",
    title: "Fan Meeting",
    description: "Simulator fan meeting bareng Ranran. Pilih jawabanmu dan kumpulkan poin kesan.",
    src: "/games/ranran-gacha/fanmeet.html",
    image: "/games/ranran-gacha/images/rose-silk.jpg",
    emoji: "💌",
    tag: "Simulasi",
  },
  {
    slug: "puzzle",
    title: "Puzzle Geser",
    description: "Susun foto Ranran yang diacak 3×3. Berhasil, kartunya masuk koleksi gacha.",
    src: "/games/ranran-gacha/puzzle.html",
    image: "/games/ranran-gacha/images/twin-tail.jpg",
    imagePosition: "50% 21%",
    emoji: "🧩",
    tag: "Puzzle",
  },
  {
    slug: "super-stage",
    title: "Super Stage",
    description: "Platformer pixel art: lompat dan lari bareng Ranran sampai ke panggung.",
    src: "/games/ranran-gacha/platformer.html",
    image: "/games/ranran-gacha/images/golden-wings.jpg",
    emoji: "🎤",
    tag: "Platformer",
  },
  {
    slug: "lightstick-catch",
    title: "Lightstick Catch",
    description: "Tangkap lightstick yang jatuh sebanyak mungkin dan kejar skor terbaikmu.",
    src: "/games/ranran-gacha/catch.html",
    image: "/games/ranran-gacha/images/city-lights.jpg",
    imagePosition: "50% 37%",
    emoji: "✨",
    tag: "Arcade",
  },
  {
    slug: "nyebrang-jalan",
    title: "Nyebrang Jalan",
    description: "Bantu Ranran menyeberang jalan dan hindari mobil yang lewat.",
    src: "/games/ranran-gacha/crossing.html",
    image: "/games/ranran-gacha/images/airport.jpg",
    emoji: "🚦",
    tag: "Arcade",
  },
  {
    slug: "petualangan",
    title: "Petualangan",
    description: "Petualangan 2D top-down bersama Ranran. Cerita fiksi buatan fans.",
    src: "/games/ranran-gacha/adventure.html",
    image: "/games/ranran-gacha/images/campus-idol.jpg",
    emoji: "🗺️",
    tag: "Petualangan",
  },
];

export const getGame = (slug: string) => GAMES.find((g) => g.slug === slug);
