# 🌹 Ranran Playground

Satu tempat untuk semua hal tentang **Song Xinran (Ranran) · SNH48**: fan site lengkap dan kumpulan mini game, dibuat oleh **ValZ**.

> Proyek fan-made, tidak berafiliasi dengan SNH48. Semua cerita di dalam game adalah fiksi.

## ✨ Fitur

### Portal (`/`)
- **Hero terowongan 3D**: foto-foto Ranran terbang ke arah layar saat di-scroll, dengan efek parallax yang mengikuti kursor
- **Toggle liquid glass** untuk langsung main game atau membuka fan site
- **Tema 🌙 Dark / 🌸 Pink** dengan transisi lingkaran dan pilihan tema yang tersimpan di browser
- **Footer stiker interaktif**: stiker bisa digeser, dan tulisan "ranran" tergambar sendiri

### Mini game (`/play/[slug]`)
| Game | Genre |
|---|---|
| Photocard Gacha | Koleksi kartu, ada SSR hologram |
| Ranran Sekolah | Cerita pixel art, lima hari, beberapa ending |
| Fan Meeting | Simulasi fan meeting |
| Puzzle Geser | Puzzle 3×3 |
| Super Stage | Platformer pixel art |
| Lightstick Catch | Arcade |
| Nyebrang Jalan | Arcade |
| Petualangan | Petualangan |

### Fan site (`/fansite`)
Riwayat tim, Senbatsu, best partners, galeri, kuis, photocard maker, buku tamu, music player, dan pilihan bahasa.

## 🛠️ Tech Stack
- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion

## 🚀 Menjalankan di Lokal

```bash
git clone <url-repo-ini>
cd xinran-app
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## ➕ Menambah Game Baru

1. Taruh file game di `public/games/<nama-folder>/`
2. Tambahkan satu entri di `lib/games.ts`:

```ts
{
  slug: "nama-game",
  title: "Nama Game",
  description: "Deskripsi singkat.",
  src: "/games/nama-folder/index.html",
  image: "/games/nama-folder/cover.jpg", // opsional
  imagePosition: "50% 20%",              // opsional, supaya wajah pas di tengah kartu
  emoji: "🎮",
  tag: "Arcade",
}
```

## 📜 Skrip

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan server development |
| `npm run build` | Build untuk production |
| `npm run start` | Menjalankan hasil build |
| `npm run lint` | Cek kode dengan ESLint |

## 💌 Kredit

Dibuat dengan 🌹 oleh **ValZ**, untuk Ranran dan semua fansnya.
Foto adalah milik masing-masing pemiliknya dan dipakai untuk keperluan fan-made non-komersial.
