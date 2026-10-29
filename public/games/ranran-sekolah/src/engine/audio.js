// Hook musik & SFX. File didaftarkan di src/art/assets.js; selama kosong, semua panggilan diam.
import { MUSIC, SFX } from "../art/assets.js";
import { getVolume } from "./save.js";

let current = null, currentId = null;

export function playMusic(id) {
  if (id === currentId) return;
  current?.pause();
  current = null;
  currentId = id;
  if (!MUSIC[id]) return;
  current = new Audio(MUSIC[id]);
  current.loop = true;
  current.volume = getVolume("music");
  current.play().catch(() => {}); // browser menolak autoplay sebelum ada interaksi; dicoba lagi di unlock()
}

// Dipanggil saat tombol pertama ditekan, supaya musik yang tertahan autoplay bisa mulai
export const unlock = () => { if (current?.paused) current.play().catch(() => {}); };

export function playSfx(id) {
  if (!SFX[id]) return;
  const a = new Audio(SFX[id]);
  a.volume = getVolume("sfx");
  a.play().catch(() => {});
}

export const applyVolume = () => { if (current) current.volume = getVolume("music"); };
