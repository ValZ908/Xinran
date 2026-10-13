// Helper kecil untuk menggambar kartu (photocard & hasil quiz) di <canvas>.

const cache = new Map<string, Promise<HTMLImageElement>>();

export function loadImage(src: string) {
  let p = cache.get(src);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
    cache.set(src, p);
  }
  return p;
}

/** Seperti object-fit: cover, dengan fokus vertikal (0 = atas, 1 = bawah). */
export function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  focusY = 0.25,
) {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (img.width - sw) / 2;
  const sy = (img.height - sh) * focusY;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

// Kata Latin dipecah per kata, huruf CJK per karakter.
const TOKENS = /[　-鿿＀-￯]|[^\s　-鿿＀-￯]+|\s+/g;

/** Tulis teks yang dibungkus ke beberapa baris. Mengembalikan y baris berikutnya. */
export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 3,
) {
  const lines: string[] = [];
  let line = "";
  for (const token of text.match(TOKENS) ?? []) {
    const test = line + token;
    if (line && ctx.measureText(test).width > maxWidth) {
      lines.push(line.trimEnd());
      line = token.trimStart();
    } else {
      line = test;
    }
  }
  if (line.trim()) lines.push(line.trimEnd());
  const shown = lines.slice(0, maxLines);
  if (lines.length > maxLines) shown[maxLines - 1] += "…";
  shown.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
  return y + shown.length * lineHeight;
}

const toBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));

export async function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const blob = await toBlob(canvas);
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Bagikan lewat menu share HP. false kalau browser tidak mendukung. */
export async function shareCanvas(canvas: HTMLCanvasElement, filename: string, text: string) {
  const blob = await toBlob(canvas);
  if (!blob) return false;
  const file = new File([blob], filename, { type: "image/png" });
  if (!navigator.canShare?.({ files: [file] })) return false;
  try {
    await navigator.share({ files: [file], text });
  } catch {
    // Pengguna menutup menu share; bukan error.
  }
  return true;
}
