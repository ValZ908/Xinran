// Penyimpanan di localStorage: progres game, ending yang sudah terbuka, dan volume.
// Data yang rusak, kosong, atau dari versi lain diabaikan; game mulai dengan data bersih.
import { DAYS, SLOTS } from "../../data/schedule.js";
import ENDINGS from "../../data/endings.js";
import * as state from "./state.js";

const KEY = "ranran-sekolah-v1";
// checkpoints: kondisi di awal tiap hari ({ "1": game, ... }), untuk pilih hari setelah tamat
const defaults = () => ({ game: null, checkpoints: {}, endings: [], volume: { music: 0.8, sfx: 0.8 } });

const isStrList = a => Array.isArray(a) && a.every(x => typeof x === "string");
const inRange = (v, min, max) => typeof v === "number" && Number.isFinite(v) && v >= min && v <= max;
const validGame = g =>
  g && typeof g === "object"
  && Number.isInteger(g.clock?.day) && g.clock.day >= 1 && g.clock.day <= DAYS.length
  && Number.isInteger(g.clock?.slot) && g.clock.slot >= 0 && g.clock.slot < SLOTS.length
  && inRange(g.vars?.trust, -99, 99) && inRange(g.vars?.courage, -99, 99)
  && isStrList(g.flags) && isStrList(g.seen);

function read() {
  const d = defaults();
  let raw = null;
  try { raw = JSON.parse(localStorage.getItem(KEY)); } catch { /* rusak / tidak tersedia */ }
  if (!raw || typeof raw !== "object") return d;
  if (validGame(raw.game)) d.game = raw.game;
  for (const [day, g] of Object.entries(raw.checkpoints ?? {}))
    if (validGame(g) && String(g.clock.day) === day && g.clock.slot === 0) d.checkpoints[day] = g;
  if (isStrList(raw.endings)) d.endings = raw.endings.filter(id => ENDINGS.some(e => e.id === id));
  for (const k of ["music", "sfx"]) if (inRange(raw.volume?.[k], 0, 1)) d.volume[k] = raw.volume[k];
  return d;
}

let data = read();
export const reload = () => { data = read(); }; // untuk tes

function write() {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* mode privat / penuh: main tetap jalan */ }
}

export const hasSave = () => data.game !== null;
export const savedClock = () => data.game?.clock;

const snapshot = () => ({ clock: { ...state.clock }, vars: { ...state.vars }, flags: [...state.flags], seen: [...state.seen] });

// atSlotStart: dipanggil tepat di awal slot. Kalau itu awal hari, simpan juga sebagai titik mulai
// hari itu (menimpa putaran sebelumnya). Simpan di tengah slot tidak mengubah titik mulai.
export function saveGame({ atSlotStart = false } = {}) {
  data.game = snapshot();
  if (atSlotStart && state.clock.slot === 0) data.checkpoints[state.clock.day] = snapshot();
  write();
}
export function loadGame() {
  if (!data.game) return false;
  state.restore(data.game);
  return true;
}
export function clearGame() { data.game = null; write(); }

export const hasCheckpoint = day => !!data.checkpoints[day];
export function loadCheckpoint(day) {
  if (!data.checkpoints[day]) return false;
  state.restore(data.checkpoints[day]);
  return true;
}

export const unlockedEndings = () => data.endings;
export function unlockEnding(id) {
  if (!data.endings.includes(id)) data.endings.push(id);
  write();
}

export const getVolume = kind => data.volume[kind];
export function setVolume(kind, v) {
  data.volume[kind] = Math.round(Math.min(1, Math.max(0, v)) * 10) / 10;
  write();
}
