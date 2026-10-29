import { g, present, text, VW, VH } from "./engine/screen.js";
import { down, pressed, confirm, endFrame } from "./engine/input.js";
import { drawFrame } from "./engine/sprites.js";
import { drawTile } from "./art/tiles.js";
import { world, player, enter, movePlayer, lockedDoorAhead, updateNpcs, faceTowardPlayer, nearbyNpc, validate, TS, MAP_W, MAP_H } from "./engine/world.js";
import * as dialog from "./engine/dialog.js";
import * as state from "./engine/state.js";
import * as days from "./engine/days.js";
import * as save from "./engine/save.js";
import * as audio from "./engine/audio.js";
import { createMenu, updateMenu, drawMenu } from "./engine/menu.js";
import STORY from "../data/story/index.js";
import ENDINGS from "../data/endings.js";
import LOCATIONS from "../data/locations.js";
import { DAYS, SLOTS } from "../data/schedule.js";

const errors = validate();
if (errors.length) console.error("Data lokasi bermasalah:\n" + errors.join("\n"));

const OY = (VH - MAP_H * TS) >> 1; // peta 176 px, layar 180 px
const FADE = 0.2, CARD = 2.2;

// mode: "menu" · "chapters" (pilih hari) · "endings" (daftar ending) · "card" (judul hari/slot) · "play" (jalan & ngobrol)
//       "night" (monolog malam) · "ending" (scene penutup) · "end" (layar judul ending)
let mode = "menu", cardT = 0;
let paused = false;
let ending = null;
let trans = null;     // perpindahan lokasi yang sedang berjalan
let banner = 0;       // sisa detik nama lokasi ditampilkan
let confirmNew = false;
let bumping = false;  // sedang menabrak pintu terkunci (pesan hanya muncul sekali per tabrakan)
let debug = false;
let time = 0;

addEventListener("keydown", audio.unlock, { once: true });

// ---------- Alur ----------
function goTo(id, at) {
  enter(id, at, days.peopleAt(id));
  banner = 2;
}

// Save otomatis tiap awal slot, jadi "Lanjutkan" mulai dari kartu judul slot ini
function startSlot() {
  mode = "card"; cardT = 0;
  save.saveGame({ atSlotStart: true });
  audio.playMusic("sekolah");
}

function beginPlay() {
  const { start, intro } = days.current();
  mode = "play";
  goTo(...start);
  if (intro) dialog.play(intro);
}

function endSlot() {
  const { night, end } = days.advance();
  const after = () => (end ? startEnding() : startSlot());
  if (!night) return after();
  mode = "night";
  audio.playMusic("malam");
  dialog.play(night, after);
}

function startEnding() {
  ending = days.pickEnding();
  mode = "ending";
  // Satu putaran selesai: ending langsung dicatat (aman walau tab ditutup saat epilog), save dihapus
  save.unlockEnding(ending.id);
  save.clearGame();
  audio.playMusic(`ending_${ending.id}`);
  dialog.play(ending.scene, () => { mode = "end"; cardT = 0; });
}

function toMenu() {
  mode = "menu"; paused = false; confirmNew = false;
  mainMenu.sel = 0;
  audio.playMusic("menu");
}

function newGame() {
  if (save.hasSave() && !confirmNew) { confirmNew = true; return; }
  state.reset();
  startSlot();
}

// ---------- Menu ----------
const pct = kind => `${Math.round(save.getVolume(kind) * 100)}%`;
const volumeItem = (label, kind) => ({
  label: () => `${label}: ${pct(kind)}`,
  adjust: d => { save.setVolume(kind, save.getVolume(kind) + d * 0.1); audio.applyVolume(); },
});

// Setelah minimal satu ending terbuka, "Lanjutkan" membuka pilihan hari
const finishedOnce = () => save.unlockedEndings().length > 0;
const continueGame = () => { save.loadGame(); startSlot(); };

const mainMenu = createMenu([
  {
    label: () => (finishedOnce() ? "Lanjutkan / Pilih Hari" : "Lanjutkan"),
    enabled: () => save.hasSave() || finishedOnce(),
    act: () => (finishedOnce() ? ((mode = "chapters"), (chapterMenu.sel = 0)) : continueGame()),
  },
  { label: () => (confirmNew ? "Mulai Baru (tekan lagi: save lama tertimpa)" : "Mulai Baru"), act: newGame },
  { label: () => `Daftar Ending (${save.unlockedEndings().length}/${ENDINGS.length})`, act: () => { mode = "endings"; } },
  volumeItem("Musik", "music"),
  volumeItem("Efek suara", "sfx"),
]);

const chapterMenu = createMenu([
  { label: () => { const c = save.savedClock(); return c ? `Save terakhir: Hari ${c.day} · ${SLOTS[c.slot].name}` : "Save terakhir: -"; },
    enabled: save.hasSave, act: continueGame },
  ...DAYS.map((name, i) => ({
    label: () => `Hari ${i + 1} · ${name}`,
    enabled: () => i === 0 || save.hasCheckpoint(i + 1),
    act: () => { if (!save.loadCheckpoint(i + 1)) state.reset(); startSlot(); },
  })),
  { label: () => "Kembali", act: () => { mode = "menu"; } },
]);

const pauseMenu = createMenu([
  { label: () => "Lanjut main", act: () => { paused = false; } },
  volumeItem("Musik", "music"),
  volumeItem("Efek suara", "sfx"),
  // Simpan kondisi sekarang; saat dilanjutkan, game mulai dari awal slot ini dengan obrolan yang sudah terjadi tetap tercatat
  { label: () => "Simpan & ke menu utama", act: () => { save.saveGame(); toMenu(); } },
]);

toMenu();

// ---------- Update ----------
const sceneFor = days.sceneFor;
const canPause = () => ["card", "play", "night"].includes(mode);

function update(dt) {
  time += dt;
  if (pressed("debug")) debug = !debug;

  if (mode === "menu") {
    if (mainMenu.sel !== 1) confirmNew = false;
    return updateMenu(mainMenu);
  }
  if (mode === "endings") { if (confirm() || pressed("pause")) mode = "menu"; return; }
  if (mode === "chapters") { if (pressed("pause")) mode = "menu"; else updateMenu(chapterMenu); return; }
  if (pressed("pause") && canPause()) { paused = !paused; pauseMenu.sel = 0; return; }
  if (paused) return updateMenu(pauseMenu);
  if (dialog.isOpen()) return dialog.update(dt);

  if (mode === "card") {
    cardT += dt;
    if (cardT >= CARD || (cardT > 0.4 && confirm())) beginPlay();
    return;
  }
  if (mode === "end") { cardT += dt; if (cardT > 1 && confirm()) toMenu(); return; }

  banner = Math.max(0, banner - dt);
  if (trans) {
    trans.t += dt;
    if (!trans.done && trans.t >= FADE) { goTo(trans.door.to, trans.door.spawn); trans.done = true; }
    if (trans.t >= FADE * 2) trans = null;
    return;
  }
  updateNpcs(dt);
  const mx = down("right") - down("left"), my = down("down") - down("up");
  const door = movePlayer(dt, mx, my);
  const locked = (mx || my) && lockedDoorAhead();
  if (locked && !bumping && locked.locked) dialog.play(locked.locked);
  bumping = !!locked;
  if (door) {
    trans = { door, t: 0, done: false };
    audio.playSfx("pintu");
  }

  const npc = nearbyNpc();
  const id = npc && confirm() && sceneFor(npc);
  if (id) {
    faceTowardPlayer(npc);
    dialog.play(id, () => { if (STORY[id].main) endSlot(); });
  }
}

// ---------- Render ----------
const WALK_CYCLE = [1, 0, 2, 0];
const walkFrame = a => (a.walk ? WALK_CYCLE[Math.floor(a.walk * 8) % 4] : 0);

function drawMap(loc) {
  for (let y = 0; y < MAP_H; y++)
    for (let x = 0; x < MAP_W; x++) drawTile(g, loc.map[y][x], x * TS, y * TS + OY, loc.floor);
}

function renderWorld() {
  drawMap(world.loc);
  // Urutkan dari atas ke bawah supaya yang lebih depan menutupi yang di belakang
  const actors = [...world.npcs, { id: "ranran", ...player }].sort((a, b) => a.y - b.y);
  for (const a of actors) drawFrame(g, a.id, a.dir, walkFrame(a), a.x, a.y + OY);

  // Tanda di atas kepala: "!" = obrolan utama, kotak kuning = bisa diajak bicara
  const near = !dialog.isOpen() && !trans && nearbyNpc();
  const marks = [];
  for (const n of world.npcs) {
    const id = sceneFor(n);
    if (!id) continue;
    const main = STORY[id].main;
    if (!main && n !== near) continue;
    const x = Math.round(n.x) + 4, y = Math.round(n.y) + OY - 11;
    g.fillStyle = main ? "#f08a6c" : "#f2d675";
    g.fillRect(x, y, 9, 9);
    marks.push({ x: x + 4.5, y: y + 1, label: n === near ? "E" : "!" });
  }
  return marks;
}

function dim(a) { g.fillStyle = `rgba(15,16,32,${a})`; g.fillRect(0, 0, VW, VH); }

function render() {
  g.fillStyle = "#1b1d2b";
  g.fillRect(0, 0, VW, VH);
  let marks = [];
  if (mode === "menu" || mode === "endings" || mode === "chapters") {
    drawMap(LOCATIONS.kelas);
    drawFrame(g, "ranran", "down", 0, 5 * TS, 5 * TS - 8 + OY);
    drawFrame(g, "yuanyuan", "down", 0, 13 * TS, 3 * TS - 8 + OY);
    dim(0.72);
  }
  if (mode === "play") marks = renderWorld();
  dialog.drawBox(g);
  if (trans) dim(1 - Math.abs(trans.t - FADE) / FADE);
  if (paused) dim(0.8);
  present();

  if (!paused) {
    for (const m of marks) text(m.label, m.x, m.y, { size: 7, align: "center", weight: 600, color: "#1b1d2b" });
    dialog.drawText(time);
  }
  const { dayName, day, slotName } = days.current();

  if (mode === "menu") {
    text("Ranran", VW / 2, 26, { size: 22, weight: 600, align: "center" });
    text("Lima hari sebelum perpisahan", VW / 2, 52, { size: 8, align: "center", color: "#f4a6b8" });
    const c = save.savedClock();
    drawMenu(mainMenu, VW / 2, 74);
    if (c) text(`Save: Hari ${c.day} (${DAYS[c.day - 1]}) · ${SLOTS[c.slot].name}`, VW / 2, 142, { size: 6, align: "center", color: "#c9cbe0" });
    text("Progres tersimpan di browser ini. Menghapus data browser akan menghapus progres.", VW / 2, 162, { size: 5.5, align: "center", color: "rgba(201,203,224,.6)" });
    text("↑↓ pilih · ←→ ubah volume · E / Enter: OK", VW / 2, 171, { size: 5.5, align: "center", color: "rgba(201,203,224,.6)" });
  }
  if (mode === "chapters") {
    text("Pilih Hari", VW / 2, 22, { size: 14, weight: 600, align: "center" });
    text("Mulai dari awal hari, dengan pilihan dari putaran terakhir yang sampai ke hari itu.", VW / 2, 40, { size: 6, align: "center", color: "#c9cbe0" });
    drawMenu(chapterMenu, VW / 2, 58);
    text("Esc: kembali", VW / 2, 160, { size: 6, align: "center", color: "rgba(201,203,224,.6)" });
  }
  if (mode === "endings") {
    text("Daftar Ending", VW / 2, 28, { size: 14, weight: 600, align: "center" });
    const got = save.unlockedEndings();
    ENDINGS.forEach((e, i) => {
      const open = got.includes(e.id), y = 62 + i * 24;
      text(`${e.id.toUpperCase()} ENDING`, VW / 2, y, { size: 6, weight: 600, align: "center", color: open ? "#f2d675" : "rgba(201,203,224,.4)" });
      text(open ? e.title : "? ? ?", VW / 2, y + 9, { size: 9, align: "center", color: open ? "#f3f0e8" : "rgba(201,203,224,.4)" });
    });
    text("E / Esc: kembali", VW / 2, 150, { size: 7, align: "center", color: "#f2d675" });
  }
  if (mode === "card" && !paused) {
    const a = Math.min(1, cardT * 3, (CARD - cardT) * 3);
    text(`Hari ${day} · ${dayName}`, VW / 2, 70, { size: 14, weight: 600, align: "center", color: `rgba(243,240,232,${a})` });
    text(slotName, VW / 2, 92, { size: 10, align: "center", color: `rgba(242,214,117,${a})` });
  }
  if (mode === "end") {
    const a = Math.min(1, cardT * 1.5);
    text(`${ending.id.toUpperCase()} ENDING`, VW / 2, 58, { size: 8, weight: 600, align: "center", color: `rgba(242,214,117,${a})` });
    text(ending.title, VW / 2, 72, { size: 16, weight: 600, align: "center", color: `rgba(243,240,232,${a})` });
    text(`Ending terbuka: ${save.unlockedEndings().length} / ${ENDINGS.length}`, VW / 2, 100, { size: 7, align: "center", color: "#c9cbe0" });
    if (cardT > 1) text("E / Enter: kembali ke menu", VW / 2, 124, { size: 7, align: "center", color: "#f2d675" });
  }
  if (mode === "play" && !dialog.isOpen() && !paused) {
    text(`Hari ${day} · ${slotName}`, VW - 6, 6, { size: 7, align: "right", color: "rgba(243,240,232,.75)" });
    if (banner) text(world.loc.name, 8, 6, { size: 10, weight: 600, color: `rgba(243,240,232,${Math.min(1, banner * 2)})` });
    text("WASD / panah: jalan · E / Enter: bicara · Esc: jeda", VW - 6, VH - 12, { size: 6, align: "right", color: "rgba(243,240,232,.5)" });
  }
  if (paused) {
    text("Jeda", VW / 2, 40, { size: 14, weight: 600, align: "center" });
    drawMenu(pauseMenu, VW / 2, 70);
    text("Esc: lanjut main", VW / 2, 140, { size: 6, align: "center", color: "rgba(201,203,224,.6)" });
  }
  if (debug) {
    text(`trust ${state.vars.trust} · courage ${state.vars.courage}`, VW - 6, 16, { size: 6, align: "right", color: "#f2d675" });
    text(`flag: ${[...state.flags].join(", ") || "-"}`, VW - 6, 24, { size: 6, align: "right", color: "#f2d675" });
  }
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  update(dt);
  render();
  endFrame();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
