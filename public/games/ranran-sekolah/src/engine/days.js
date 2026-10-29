import SCHEDULE, { DAYS, SLOTS } from "../../data/schedule.js";
import ENDINGS from "../../data/endings.js";
import STORY from "../../data/story/index.js";
import { clock, seen, check } from "./state.js";

const slotData = () => SCHEDULE[clock.day]?.[SLOTS[clock.slot].id] ?? {};

// Info slot sekarang untuk kartu judul dan titik muncul player
export function current() {
  const slot = SLOTS[clock.slot], data = slotData();
  return { dayName: DAYS[clock.day - 1], day: clock.day, slotName: slot.name, start: data.start ?? slot.start, intro: data.intro };
}

// { karakter: [scene...] } yang ada di lokasi ini pada slot sekarang.
// Entri jadwal boleh berupa { when, talk } supaya kehadiran NPC bersyarat.
export const peopleAt = loc => Object.fromEntries(
  Object.entries(slotData()[loc] ?? {})
    .map(([who, e]) => (Array.isArray(e) ? [who, e] : check(e.when) ? [who, e.talk] : null))
    .filter(Boolean),
);

// Scene yang diputar saat NPC diajak bicara: yang pertama di daftar yang belum pernah diputar
// (kecuali `repeat: true`) dan syaratnya terpenuhi. Kalau habis, obrolan ringan `<karakter>_idle`.
export const sceneFor = npc =>
  [...npc.talk, `${npc.id}_idle`].find(id => STORY[id] && (STORY[id].repeat || !seen.has(id)) && check(STORY[id].when));

// Maju satu slot. Setelah slot terakhir: hari berikutnya, didahului monolog malam (kalau ada).
export function advance() {
  if (++clock.slot < SLOTS.length) return { night: null, end: false };
  const night = SCHEDULE[clock.day]?.malam ?? null;
  clock.slot = 0;
  clock.day++;
  return { night, end: clock.day > DAYS.length };
}

// Ending pertama (berurutan) yang syaratnya terpenuhi; yang terakhir tanpa syarat jadi cadangan.
export const pickEnding = () => ENDINGS.find(e => check(e.when));
