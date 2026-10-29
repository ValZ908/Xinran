// Daftar pilihan sederhana untuk menu utama dan layar jeda.
// item: { label: () => teks, enabled?: () => bool, act?: () => void, adjust?: (arah -1|1) => void }
import { pressed, pointer } from "./input.js";
import { text, VW } from "./screen.js";
import { playSfx } from "./audio.js";

export const createMenu = items => ({ items, sel: 0 });
const enabled = it => it.enabled?.() ?? true;

export function updateMenu(m) {
  const n = m.items.length;
  const move = d => {
    for (let i = 0; i < n; i++) {
      m.sel = (m.sel + d + n) % n;
      if (enabled(m.items[m.sel])) break;
    }
    playSfx("pilih");
  };
  if (!enabled(m.items[m.sel])) move(1);
  if (pressed("up")) move(-1);
  if (pressed("down")) move(1);
  // Mouse: sorot item di bawah kursor, klik = pilih (volume: klik kiri layar turun, kanan naik)
  const hover = itemAt(m, pointer);
  if (pointer.moved && hover >= 0 && hover !== m.sel) { m.sel = hover; playSfx("pilih"); }
  const clicked = pressed("click") && hover >= 0;
  if (clicked) m.sel = hover;
  const it = m.items[m.sel];
  if (it.adjust && (pressed("left") || pressed("right"))) { it.adjust(pressed("right") ? 1 : -1); playSfx("pilih"); }
  if (it.adjust && clicked) { it.adjust(pointer.x >= VW / 2 ? 1 : -1); playSfx("pilih"); }
  if ((pressed("act") || clicked) && it.act) { playSfx("ok"); it.act(); }
}

const itemAt = (m, p) => {
  if (!m.layout || Math.abs(p.x - VW / 2) > 130) return -1;
  const i = Math.floor((p.y - m.layout.y + 3) / m.layout.gap);
  return i >= 0 && i < m.items.length && enabled(m.items[i]) ? i : -1;
};

export function drawMenu(m, x, y, { align = "center", gap = 13 } = {}) {
  m.layout = { y, gap };
  m.items.forEach((it, i) => {
    const on = i === m.sel, ok = enabled(it);
    const label = it.adjust && on ? `◂ ${it.label()} ▸` : it.label();
    text(on ? `▸ ${label}` : label, x, y + i * gap, {
      size: 8, align, weight: on ? 600 : 400,
      color: !ok ? "rgba(201,203,224,.35)" : on ? "#f2d675" : "#c9cbe0",
    });
  });
}
