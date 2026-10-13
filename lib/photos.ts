// Semua foto disimpan di public/images supaya tidak hilang kalau link
// Pinterest / wikia mati. Tambah foto baru di sini.

export type Photo = { id: string; src: string; alt: string };

export const HERO_PHOTO = "/images/hero.jpg";

export const SENBATSU_PHOTOS = {
  2020: "/images/senbatsu-2020.webp",
  2023: "/images/senbatsu-2023.jpg",
  2025: "/images/senbatsu-2025.jpg",
} as const;

export const GALLERY: Photo[] = [
  { id: "gallery-1", src: "/images/gallery-1.jpg", alt: "Song Xinran 1" },
  { id: "gallery-2", src: "/images/gallery-2.jpg", alt: "Song Xinran 2" },
  { id: "gallery-3", src: "/images/gallery-3.jpg", alt: "Song Xinran 3" },
  { id: "gallery-4", src: "/images/gallery-4.jpg", alt: "Song Xinran, 10th Senbatsu Election" },
  { id: "gallery-5", src: "/images/gallery-5.jpg", alt: "Song Xinran 4" },
  { id: "gallery-6", src: "/images/gallery-6.jpg", alt: "Song Xinran 5" },
  { id: "gallery-7", src: "/images/gallery-7.jpg", alt: "Song Xinran, 12th Senbatsu Election" },
  { id: "gallery-8", src: "/images/gallery-8.jpg", alt: "Song Xinran 6" },
];

/** Foto yang bisa dipilih di generator photocard. */
export const CARD_PHOTOS: Photo[] = [
  ...GALLERY,
  { id: "senbatsu-2025", src: SENBATSU_PHOTOS[2025], alt: "Song Xinran, 2025" },
  { id: "senbatsu-2023", src: SENBATSU_PHOTOS[2023], alt: "Song Xinran, 2023" },
  { id: "senbatsu-2020", src: SENBATSU_PHOTOS[2020], alt: "Song Xinran, 2020" },
];
