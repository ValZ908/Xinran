import LOCATIONS from "../../data/locations.js";
import { WALKABLE } from "../art/tiles.js";
import { check } from "./state.js";

export const TS = 16, MAP_W = 20, MAP_H = 11;
export const world = { id: null, loc: null, npcs: [] };
export const player = { x: 0, y: 0, dir: "down", walk: 0 };

const NPC_SPEED = 24, WANDER = TS; // NPC jalan santai, paling jauh 1 petak dari tempatnya

// Sprite 16×24 dengan kaki di petak (tx, ty)
const place = ([tx, ty]) => ({ x: tx * TS, y: ty * TS - 8 });

// people: { karakter: [scene...] } dari jadwal untuk lokasi ini
export function enter(id, at, people = {}) {
  world.id = id;
  world.loc = LOCATIONS[id];
  Object.assign(player, place(at), { walk: 0 });
  world.npcs = Object.entries(people).map(([who, talk]) => {
    const home = place(world.loc.spots[who]);
    return { id: who, talk, home, ...home, dir: "down", walk: 0, target: null, wait: 1 + Math.random() * 2 };
  });
  // Petak yang tidak boleh diinjak NPC: pintu dan titik muncul player
  world.noNpc = new Set(Object.values(LOCATIONS).flatMap(l => l.doors).filter(d => d.to === id).map(d => d.spawn.join(",")));
  world.noNpc.add(at.join(","));
  world.loc.doors.forEach(d => world.noNpc.add(d.at.join(",")));
}

const tileAt = (tx, ty) => world.loc.map[ty]?.[tx] ?? " ";
// Pintu yang syarat `when`-nya belum terpenuhi diperlakukan seperti dinding
const lockedAt = (tx, ty) => world.loc.doors.find(d => d.at[0] === tx && d.at[1] === ty && d.when && !check(d.when));
const solidAt = (px, py) => {
  const tx = Math.floor(px / TS), ty = Math.floor(py / TS);
  return !WALKABLE.has(tileAt(tx, ty)) || !!lockedAt(tx, ty);
};
// Kotak tabrakan = kaki (10×6 di bagian bawah sprite), untuk player maupun NPC
const feetOverlap = (ax, ay, b) => ax + 3 < b.x + 13 && b.x + 3 < ax + 13 && ay + 18 < b.y + 24 && b.y + 18 < ay + 24;
const corners = (x, y) => [[x + 3, y + 18], [x + 12, y + 18], [x + 3, y + 23], [x + 12, y + 23]];
const wallsFree = (x, y) => !corners(x, y).some(([px, py]) => solidAt(px, py));

// mx, my: -1..1. Mengembalikan pintu kalau kaki player menginjak petak pintu.
export function movePlayer(dt, mx, my) {
  if (mx && my) { mx *= Math.SQRT1_2; my *= Math.SQRT1_2; }
  if (my) player.dir = my > 0 ? "down" : "up";
  if (mx) player.dir = mx > 0 ? "right" : "left";
  // NPC yang sudah bertumpuk dengan player (misal baru masuk ruangan) tidak menghalangi, supaya tidak terjebak
  const blockers = world.npcs.filter(n => !feetOverlap(player.x, player.y, n));
  const free = (x, y) => wallsFree(x, y) && !blockers.some(n => feetOverlap(x, y, n));
  const sp = 64 * dt;
  // Gerak per sumbu supaya bisa menyusur dinding
  if (mx && free(player.x + mx * sp, player.y)) player.x += mx * sp;
  if (my && free(player.x, player.y + my * sp)) player.y += my * sp;
  player.walk = mx || my ? player.walk + dt : 0;

  const fx = Math.floor((player.x + 8) / TS), fy = Math.floor((player.y + 21) / TS);
  return world.loc.doors.find(d => d.at[0] === fx && d.at[1] === fy) ?? null;
}

// Pintu terkunci tepat di depan kaki player (untuk menampilkan pesan saat menabraknya)
export function lockedDoorAhead() {
  const [dx, dy] = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[player.dir];
  const fx = player.x + 8 + dx * 9, fy = player.y + 21 + dy * 9;
  return lockedAt(Math.floor(fx / TS), Math.floor(fy / TS)) ?? null;
}

function npcFree(n, x, y) {
  if (Math.abs(x - n.home.x) > WANDER || Math.abs(y - n.home.y) > WANDER) return false;
  if (!wallsFree(x, y)) return false;
  if (corners(x, y).some(([px, py]) => world.noNpc.has(`${Math.floor(px / TS)},${Math.floor(py / TS)}`))) return false;
  if (feetOverlap(x, y, player)) return false;
  return !world.npcs.some(o => o !== n && feetOverlap(x, y, o));
}

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
// NPC berjalan-jalan kecil di sekitar tempatnya: diam sebentar, melangkah 1 petak, diam lagi.
export function updateNpcs(dt) {
  for (const n of world.npcs) {
    if (!n.target) {
      n.walk = 0;
      if ((n.wait -= dt) > 0) continue;
      const [dx, dy] = DIRS[Math.floor(Math.random() * 4)];
      const t = { x: n.x + dx * TS, y: n.y + dy * TS };
      if (npcFree(n, t.x, t.y)) {
        n.target = t;
        n.dir = dy < 0 ? "up" : "down"; // shortcut: placeholder NPC belum punya tampak samping
      } else n.wait = 0.5;
      continue;
    }
    const dx = n.target.x - n.x, dy = n.target.y - n.y, dist = Math.hypot(dx, dy);
    const step = Math.min(dist, NPC_SPEED * dt);
    const nx = n.x + (dx / dist) * step, ny = n.y + (dy / dist) * step;
    if (!npcFree(n, nx, ny)) { n.target = null; n.wait = 1; continue; } // terhalang player
    n.x = nx; n.y = ny; n.walk += dt;
    if (step >= dist) { n.target = null; n.wait = 2 + Math.random() * 4; }
  }
}

// NPC berhenti dan menoleh ke player saat diajak bicara
export function faceTowardPlayer(n) {
  n.target = null; n.walk = 0;
  n.dir = player.y < n.y - 4 ? "up" : "down";
}

// NPC terdekat dalam jangkauan bicara, atau null
export function nearbyNpc() {
  let best = null, bestD = 24;
  for (const n of world.npcs) {
    const d = Math.hypot(n.x - player.x, n.y - player.y);
    if (d < bestD) { best = n; bestD = d; }
  }
  return best;
}

const isFloor = ch => WALKABLE.has(ch) && ch !== "D" && ch !== "S";

// Cek data lokasi; dipakai `npm run check` dan saat game dimulai.
export function validate() {
  const errors = [];
  for (const [id, loc] of Object.entries(LOCATIONS)) {
    if (loc.map.length !== MAP_H || loc.map.some(r => r.length !== MAP_W)) errors.push(`${id}: peta harus ${MAP_W}×${MAP_H}`);
    loc.map.forEach((row, y) => [...row].forEach((ch, x) => {
      if ((ch === "D" || ch === "S") && !loc.doors.some(d => d.at[0] === x && d.at[1] === y)) errors.push(`${id}: pintu di ${x},${y} tidak punya tujuan`);
    }));
    for (const d of loc.doors) {
      const target = LOCATIONS[d.to];
      if (!target) { errors.push(`${id}: tujuan "${d.to}" tidak ada`); continue; }
      if (!isFloor(target.map[d.spawn[1]]?.[d.spawn[0]])) errors.push(`${id} → ${d.to}: spawn ${d.spawn} bukan lantai biasa`);
    }
    const spawns = Object.values(LOCATIONS).flatMap(l => l.doors).filter(d => d.to === id).map(d => d.spawn.join(","));
    for (const [who, [x, y]] of Object.entries(loc.spots ?? {})) {
      if (!isFloor(loc.map[y]?.[x])) errors.push(`${id}: spot ${who} di ${x},${y} bukan lantai biasa`);
      if (spawns.includes(`${x},${y}`)) errors.push(`${id}: spot ${who} menutupi titik muncul player`);
    }
  }
  return errors;
}
