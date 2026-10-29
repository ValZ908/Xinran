import { CHARACTER_ART } from "../art/characters.js";
import { SPRITE_PNG, PORTRAIT_PNG } from "../art/assets.js";

export const FW = 16, FH = 24, PORTRAIT = 48;
const DIRS = ["down", "up", "left", "right"];
const sheets = {}, portraits = {};

function paint(x, rows, pal, ox, oy, flip) {
  rows.forEach((r, j) => [...r].forEach((ch, i) => {
    if (!pal[ch]) return;
    x.fillStyle = pal[ch];
    x.fillRect(ox + (flip ? FW - 1 - i : i), oy + j, 1, 1);
  }));
}

// Placeholder dibangun dengan tata letak yang sama persis dengan spritesheet PNG final.
// Arah/frame yang tidak digambar memakai frame depan.
function placeholder(art) {
  const c = document.createElement("canvas");
  c.width = FW * 3; c.height = FH * 4;
  const x = c.getContext("2d");
  DIRS.forEach((dir, row) => {
    const mirrored = dir === "left" && art.right;
    const frames = mirrored ? art.right : art[dir] ?? art.down;
    for (let f = 0; f < 3; f++) paint(x, frames[f] ?? frames[0], art.palette, f * FW, row * FH, mirrored);
  });
  return c;
}

const load = (src, onload) => { const img = new Image(); img.onload = () => onload(img); img.src = src; };

for (const [id, art] of Object.entries(CHARACTER_ART)) {
  sheets[id] = placeholder(art);
  if (SPRITE_PNG[id]) load(SPRITE_PNG[id], img => { sheets[id] = img; });
}
for (const [key, src] of Object.entries(PORTRAIT_PNG)) load(src, img => { portraits[key] = img; });

export function drawFrame(g, id, dir, frame, x, y) {
  g.drawImage(sheets[id], frame * FW, DIRS.indexOf(dir) * FH, FW, FH, Math.round(x), Math.round(y), FW, FH);
}

// Portrait PNG kalau ada; kalau belum, kepala sprite (16×16) diperbesar 3× jadi 48×48.
export function drawPortrait(g, id, face, x, y) {
  const img = portraits[`${id}_${face}`] ?? portraits[id];
  if (img) g.drawImage(img, x, y, PORTRAIT, PORTRAIT);
  else g.drawImage(sheets[id], 0, 0, FW, 16, x, y, PORTRAIT, PORTRAIT);
}
