// Tile placeholder 16×16 dari blok warna. Huruf yang tidak dikenal dianggap padat.
//  .  lantai (warna per lokasi)   p  jalan setapak   D  pintu   S  tangga
//  #  dinding   (spasi) kosong    w  jendela         B  papan tulis
//  d  meja      k  meja guru      b  rak buku        l  loker
//  r  pagar atap  h  tandon air   n  bangku          t  pohon     G  gerbang
export const WALKABLE = new Set([".", "p", "D", "S"]);

const BOOKS = ["#b5534a", "#3f6a8a", "#c9a24a", "#5a8a5f"];

export function drawTile(g, ch, x, y, floor) {
  const R = (c, ax, ay, w, h) => { g.fillStyle = c; g.fillRect(x + ax, y + ay, w, h); };
  const wall = () => { R("#e8dcc8", 0, 0, 16, 16); R("#c9b9a0", 0, 12, 16, 4); };
  R(floor, 0, 0, 16, 16);
  switch (ch) {
    case " ": R("#1b1d2b", 0, 0, 16, 16); break;
    case "#": wall(); break;
    case "w": wall(); R("#9ec9e6", 2, 2, 12, 8); R("#e8dcc8", 7, 2, 2, 8); break;
    case "B": wall(); R("#2f4a3a", 0, 2, 16, 9); R("#dfe8df", 3, 5, 6, 1); break;
    case "d": R("#a0703f", 2, 3, 12, 7); R("#7a5230", 2, 10, 12, 2); R("#7a5230", 3, 12, 2, 3); R("#7a5230", 11, 12, 2, 3); break;
    case "k": R("#7a4a2a", 0, 2, 16, 10); R("#5a3520", 0, 12, 16, 2); break;
    case "b":
      R("#6b4a2f", 0, 0, 16, 16);
      for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) R(BOOKS[(i + j) % 4], 1 + j * 4, 1 + i * 5, 3, 4);
      break;
    case "l": R("#5b7a99", 1, 0, 14, 16); R("#46607a", 8, 0, 1, 16); R("#c8ccd6", 5, 7, 2, 2); R("#c8ccd6", 10, 7, 2, 2); break;
    case "D": R("#8a5a3a", 1, 0, 14, 16); R("#6b4228", 1, 15, 14, 1); R("#e0b860", 11, 8, 2, 2); break;
    case "S": for (let i = 0; i < 4; i++) R(i % 2 ? "#9a9aa5" : "#c0c0c8", 0, i * 4, 16, 4); break;
    case "p": R("#d9c49a", 0, 0, 16, 16); break;
    case "t": R("#6b4a2f", 6, 9, 4, 7); R("#3f7a4a", 1, 0, 14, 11); R("#5a9a5f", 4, 2, 4, 3); break;
    case "r": R("#6b6b75", 0, 3, 16, 2); R("#6b6b75", 0, 10, 16, 2); R("#55555e", 2, 3, 2, 11); R("#55555e", 12, 3, 2, 11); break;
    case "h": R("#8fa3b0", 0, 0, 16, 16); R("#7a8e9b", 0, 5, 16, 1); break;
    case "n": R("#a0703f", 0, 5, 16, 4); R("#7a5230", 2, 9, 2, 4); R("#7a5230", 12, 9, 2, 4); break;
    case "G": R("#3a3d46", 0, 2, 16, 2); for (let i = 1; i < 16; i += 4) R("#3a3d46", i, 2, 2, 14); break;
  }
}
