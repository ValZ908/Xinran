// Dunia digambar di buffer 320×180 lalu diperbesar kelipatan bulat (tajam, tanpa blur).
// Teks digambar langsung di kanvas layar pada resolusi penuh supaya terbaca.
export const VW = 320, VH = 180;

const cv = document.getElementById("game");
const ctx = cv.getContext("2d");
const buf = document.createElement("canvas");
buf.width = VW; buf.height = VH;
export const g = buf.getContext("2d");

let scale = 1, ox = 0, oy = 0;
function resize() {
  const dpr = devicePixelRatio || 1;
  cv.width = Math.round(innerWidth * dpr);
  cv.height = Math.round(innerHeight * dpr);
  scale = Math.max(1, Math.floor(Math.min(cv.width / VW, cv.height / VH)));
  ox = (cv.width - VW * scale) >> 1;
  oy = (cv.height - VH * scale) >> 1;
}
addEventListener("resize", resize);
resize();

// Posisi mouse di layar → koordinat piksel game (320×180)
export const toGame = (clientX, clientY) => {
  const dpr = devicePixelRatio || 1;
  return { x: (clientX * dpr - ox) / scale, y: (clientY * dpr - oy) / scale };
};

export function present() {
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#0f1020";
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.drawImage(buf, ox, oy, VW * scale, VH * scale);
}

const font = (size, weight) => `${weight} ${size * scale}px "Pixelify Sans", monospace`;

// x, y, size dalam satuan piksel game (320×180)
export function text(str, x, y, { size = 8, color = "#f3f0e8", align = "left", weight = 400 } = {}) {
  ctx.font = font(size, weight);
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "top";
  ctx.fillText(str, ox + x * scale, oy + y * scale);
}

// Pecah teks jadi baris yang muat di lebar maxW (piksel game).
export function wrap(str, maxW, size = 8, weight = 400) {
  ctx.font = font(size, weight);
  const lines = [];
  let line = "";
  for (const word of str.split(" ")) {
    const t = line ? line + " " + word : word;
    if (line && ctx.measureText(t).width / scale > maxW) { lines.push(line); line = word; } else line = t;
  }
  return [...lines, line];
}

cv.focus();
