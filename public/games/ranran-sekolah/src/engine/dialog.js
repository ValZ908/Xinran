import STORY from "../../data/story/index.js";
import CHARACTERS from "../../data/characters.js";
import { pressed, confirm, pointer } from "./input.js";
import { text, wrap, VW, VH } from "./screen.js";
import { drawPortrait, PORTRAIT } from "./sprites.js";
import * as state from "./state.js";
import { playSfx } from "./audio.js";

const SPEED = 45;                       // huruf per detik
const BOX = { x: 4, y: VH - 58, w: VW - 8, h: 54 };
const TEXT_X = BOX.x + PORTRAIT + 10, TEXT_W = BOX.x + BOX.w - TEXT_X - 8;

let cur = null; // { lines, i, line, shown, rows, options, sel, onEnd }
export const isOpen = () => cur !== null;
export const isChoosing = () => !!cur?.options;
export const optionTexts = () => cur?.options?.map(o => o.text) ?? [];

export function play(id, onEnd) {
  cur = { onEnd };
  jump(id);
}

function jump(id) {
  cur.lines = STORY[id].lines;
  cur.i = -1;
  state.seen.add(id);
  next();
}

// Maju ke baris berikutnya yang bisa ditampilkan; baris efek (add/set/goto) dijalankan langsung.
function next() {
  for (;;) {
    const line = cur.lines[++cur.i];
    if (!line) { const end = cur.onEnd; cur = null; end?.(); return; }
    if (line.when && !state.check(line.when)) continue;
    state.apply(line);
    cur.options = null;
    if (line.text) {
      cur.line = line;
      cur.shown = 0;
      cur.rows = wrap(line.text, TEXT_W);
      return;
    }
    if (line.choice) {
      cur.line = line;
      cur.options = line.choice.filter(o => !o.when || state.check(o.when));
      cur.sel = 0;
      return;
    }
    if (line.goto) return jump(line.goto);
  }
}

export function update(dt) {
  if (!cur) return;
  if (cur.options) {
    const n = cur.options.length, hover = optionAt(pointer);
    if (pressed("up")) { cur.sel = (cur.sel + n - 1) % n; playSfx("pilih"); }
    if (pressed("down")) { cur.sel = (cur.sel + 1) % n; playSfx("pilih"); }
    if (pointer.moved && hover >= 0 && hover !== cur.sel) { cur.sel = hover; playSfx("pilih"); }
    // Klik hanya berlaku kalau tepat di salah satu opsi, supaya tidak salah pilih
    const clicked = pressed("click") && hover >= 0;
    if (clicked) cur.sel = hover;
    if (pressed("act") || clicked) {
      playSfx("ok");
      const o = cur.options[cur.sel];
      state.apply(o);
      // `reply`: baris balasan khusus opsi ini, diputar sebelum baris berikutnya
      if (o.reply) cur.lines = [...cur.lines.slice(0, cur.i + 1), ...o.reply, ...cur.lines.slice(cur.i + 1)];
      o.goto ? jump(o.goto) : next();
    }
    return;
  }
  const len = cur.line.text.length, before = Math.floor(cur.shown / 3);
  cur.shown = Math.min(len, cur.shown + dt * SPEED);
  if (Math.floor(cur.shown / 3) > before) playSfx("ketik"); // bunyi tiap 3 huruf
  if (confirm()) cur.shown < len ? (cur.shown = len) : next();
}

const OPT_Y = BOX.y + 8, OPT_GAP = 14;
const optionAt = p => {
  if (p.x < BOX.x || p.x > BOX.x + BOX.w) return -1;
  const i = Math.floor((p.y - OPT_Y + 3) / OPT_GAP);
  return i >= 0 && i < cur.options.length ? i : -1;
};

// Bagian piksel (kotak, portrait) digambar ke buffer game sebelum present().
export function drawBox(g) {
  if (!cur) return;
  g.fillStyle = "#222842"; g.fillRect(BOX.x, BOX.y, BOX.w, BOX.h);
  g.fillStyle = "#3a4166"; g.fillRect(BOX.x, BOX.y, BOX.w, 1); g.fillRect(BOX.x, BOX.y + BOX.h - 1, BOX.w, 1);
  g.fillRect(BOX.x, BOX.y, 1, BOX.h); g.fillRect(BOX.x + BOX.w - 1, BOX.y, 1, BOX.h);
  const who = !cur.options && cur.line.who;
  if (who) {
    g.fillStyle = "#1b1f33"; g.fillRect(BOX.x + 3, BOX.y + 3, PORTRAIT, PORTRAIT);
    drawPortrait(g, who, cur.line.face, BOX.x + 3, BOX.y + 3);
  }
}

// Bagian teks digambar di resolusi layar setelah present().
export function drawText(time) {
  if (!cur) return;
  if (cur.options) {
    cur.options.forEach((o, i) => {
      const on = i === cur.sel;
      text((on ? "▸ " : "  ") + o.text, BOX.x + 12, OPT_Y + i * OPT_GAP, { size: 8, color: on ? "#f2d675" : "#c9cbe0", weight: on ? 600 : 400 });
    });
    return;
  }
  const who = cur.line.who, x = who ? TEXT_X : BOX.x + 10;
  if (who) text(CHARACTERS[who].name, x, BOX.y + 5, { size: 8, weight: 600, color: CHARACTERS[who].color });
  let left = Math.floor(cur.shown);
  cur.rows.forEach((row, i) => {
    if (left <= 0) return;
    text(row.slice(0, left), x, BOX.y + (who ? 17 : 9) + i * 10, { size: 8, color: who ? "#f3f0e8" : "#c9cbe0" });
    left -= row.length + 1;
  });
  if (cur.shown >= cur.line.text.length && Math.floor(time * 2) % 2)
    text("▼", BOX.x + BOX.w - 10, BOX.y + BOX.h - 11, { size: 6, color: "#f2d675" });
}
