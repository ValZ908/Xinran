// Placeholder pixel art dari Character Sheet (16×24, 1 huruf = 1 piksel, "." = transparan).
// Tiap arah punya 3 frame: [diam, langkah A, langkah B]. Kiri = cermin dari kanan.

const ranranBody = {
  down: [
    "....hhhhhhhh....",
    "...hhhHHhhhhh...",
    "..hhhhhhhhhhhh..",
    "..hhhhhhhhhhhh..",
    "..hhsssssssshh..",
    "..hssssssssssh..",
    "..hseesssseesh..",
    "..hbssssssssbh..",
    "..hssssmmssssh..",
    "..hhsssssssshh..",
    ".hhwwwwttwwwwhh.",
    ".hhwwwwttwwwwhh.",
    ".hswwwwttwwwgsh.",
    ".hswwwwttwwwwsh.",
    ".h.wwwwttwwww.h.",
    "...kkkkkkkkkk...",
    "...kKkKkKkKkk...",
    "...kgkkkkkkgk...",
    "....kkkkkkkk....",
  ],
  up: [
    "....hhhhhhhh....",
    "...hhhHHhhhhh...",
    "..hhhhhhhhhhhh..",
    "..hhhhhhhhhhhh..",
    "..hhhhhhhhhhhh..",
    "..hhhhhhhhhhhh..",
    "..hhhhhhhhhhhh..",
    "..hhhhhhhhhhhh..",
    "..hhhhhhhhhhhh..",
    "..hhhhhhhhhhhh..",
    ".hhhhhhhhhhhhhh.",
    ".hhhhhhhhhhhhhh.",
    ".whhhhhhhhhhhhw.",
    ".swhhhhhhhhhhws.",
    "...wwhhhhhhww...",
    "...kkkkkkkkkk...",
    "...kKkKkKkKkk...",
    "...kkkkkkkkkk...",
    "....kkkkkkkk....",
  ],
  right: [
    "....hhhhhhh.....",
    "...hhhhhhHHh....",
    "..hhhhhhhhhhh...",
    "..hhhhhhhhhhhh..",
    "..hhhhhhsssssh..",
    "..hhhhhsssssss..",
    "..hhhhhssssess..",
    "..hhhhhsssbsss..",
    "..hhhhhsssssms..",
    "..hhhhhhssss....",
    "..hhhhwwwwwt....",
    "..hhhhwwwwwt....",
    "..hhhwwswwwt....",
    "..hhhwwswwww....",
    "...hhwwswwww....",
    "....kkkkkkkk....",
    "....kKkKkKkk....",
    "....kkkkkkgk....",
    ".....kkkkkk.....",
  ],
};

const LEGS_FRONT = [
  [".....ss..ss.....", ".....ss..ss.....", ".....ss..ss.....", ".....oo..oo.....", ".....oo..oo....."],
  [".....ss..ss.....", ".....oo..ss.....", ".....oo..ss.....", ".........oo.....", ".........oo....."],
  [".....ss..ss.....", ".....ss..oo.....", ".....ss..oo.....", ".....oo.........", ".....oo........."],
];
const LEGS_SIDE = [
  [".......ss.......", ".......ss.......", ".......ss.......", ".......ss.......", ".......ooo......"],
  ["......ss.ss.....", ".....ss...ss....", ".....ss...ss....", "....ss.....ss...", "....oo.....ooo.."],
  ["......sss.......", "......sss.......", ".......ss.......", ".......ss.......", ".......ooo......"],
];
const withLegs = (body, legs) => ({
  down: legs.front.map(l => [...body.down, ...l]),
  up: legs.front.map(l => [...body.up, ...l]),
  right: legs.side.map(l => [...body.right, ...l]),
});

// NPC digambar tampak depan saja; tampak belakang dibuat otomatis:
// detail wajah di kepala (baris 0–9) jadi rambut, badan (baris 10–14) jadi warna `torso`
// kecuali kulit lengan dan huruf di `keep`.
// shortcut: jalan ke kiri/kanan memakai tampak depan; tambah `right` kalau NPC perlu tampak samping.
const FACE = /[sebmTW]/g;
const backView = (body, { hair = "h", torso, keep = "" }) => body.map((r, i) =>
  i < 10 ? r.replace(FACE, hair)
  : i < 15 ? [...r].map(ch => (ch === "." || ch === "s" || keep.includes(ch) ? ch : torso)).join("")
  : r);
const npc = (palette, body, legs, back) => ({
  palette,
  down: legs.map(l => [...body, ...l]),
  up: legs.map(l => [...backView(body, back), ...l]),
});
const SKIRT_LEGS = LEGS_FRONT;
const SOCK_LEGS = LEGS_FRONT.map(f => f.map((r, i) => (i === 2 || i === 3 ? r.replace(/s/g, "W") : r)));
const PANTS_LEGS = [
  ["....kkk..kkk....", "....kkk..kkk....", "....kkk..kkk....", "....ooo..ooo....", "....ooo..ooo...."],
  ["....kkk..kkk....", "....ooo..kkk....", "....ooo..kkk....", ".........ooo....", ".........ooo...."],
  ["....kkk..kkk....", "....kkk..ooo....", "....kkk..ooo....", "....ooo.........", "....ooo........."],
];

export const CHARACTER_ART = {
  yuanyuan: npc(
    // #1c1f2e #f6dcc9 #d6453d #f4f1ea #7a1f26
    { h: "#1c1f2e", H: "#3a3f5a", s: "#f6dcc9", e: "#1c1f2e", b: "#f0a8a0", m: "#d6453d", w: "#f4f1ea",
      r: "#d6453d", R: "#7a1f26", g: "#c8ccd6", k: "#2a3050", W: "#f4f1ea", o: "#2a2026" },
    [
      "....hhhhhhhh....",
      "...hhhhHHhhhh...",
      "..hhhhhhhhhhhh..",
      "..hhhhhhhhhhhh..",
      "..hhhhhhhhhhhh..",
      "..hhsssssssshh..",
      "..hhseesseeshh..",
      "..hhbssssssbhh..",
      "..hhsssmmssshh..",
      "..hhhseeeeshhh..",
      ".hhwrRrRgrRrwhh.",
      ".hhwRrRrgRrRwhh.",
      ".hswrRrRgrRrwsh.",
      ".hswRrRrRrRrwsh.",
      ".h.wrrrrrrrrw.h.",
      "...kkkkkkkkkk...",
      "...kkkkkkkkkk...",
      "...kkkkkkkkkk...",
      "....kkkkkkkk....",
    ],
    SOCK_LEGS,
    { torso: "r", keep: "h" },
  ),
  hao: npc(
    // #3b2a1f #e2b48a #c0392b #2f5fa8
    { h: "#3b2a1f", H: "#5a3f2c", s: "#e2b48a", e: "#2a1a12", b: "#e09a80", m: "#8a2a20", T: "#ffffff",
      w: "#f3f0e8", t: "#2f5fa8", r: "#c0392b", R: "#962d22", k: "#2a2f3e", o: "#f3f0e8" },
    [
      "...h.hh..hh.h...",
      "...hhhhhhhhhh...",
      "..hhhhHHhhhhhh..",
      "..hhhhhhhhhhhh..",
      "..hhsssssssshh..",
      "..hssssssssssh..",
      "..hseesssseesh..",
      "..hbssssssssbh..",
      "..hssmTTTTmssh..",
      "....ssssssss....",
      "..wwwwwttwwwww..",
      ".swwwwwttwwwwws.",
      ".swwwwwttwwwwws.",
      ".srrrrrttrrrrrs.",
      "..rrrrRrrRrrrr..",
      "...kkkkRRkkkk...",
      "...kkkkRRkkkk...",
      "...kkkk..kkkk...",
      "...kkkk..kkkk...",
    ],
    PANTS_LEGS,
    { torso: "w", keep: "rR" },
  ),
  bumei: npc(
    // #3a2d3f #efcdb0 #d9a441 #6b4f3a
    { h: "#3a2d3f", H: "#5a4a5f", y: "#e6c35a", s: "#efcdb0", e: "#2a2030", b: "#e0a090", m: "#b5584a",
      w: "#f3f0e8", l: "#3f6aa8", c: "#d9a441", k: "#6b4f3a", K: "#5a4130", o: "#2a2026" },
    [
      ".....hhhh.yy....",
      "....hhhhhhy.....",
      "...hhhhHHhhhh...",
      "..hhhhhhhhhhhh..",
      "..hhhhhhhhhhhh..",
      "..hhsssssssshh..",
      "..hhseesseeshh..",
      "..hhbssssssbhh..",
      "...hsssmmsssh...",
      ".....ssssss.....",
      "..ccwlwwwwlwcc..",
      "..ccwlwwwwlwcc..",
      ".sccwwllllwwccs.",
      ".sccwwwllwwwccs.",
      "..ccwwwwwwwwcc..",
      "...kkkkkkkkkk...",
      "...kkkkKkkkkk...",
      "...kkkkKkkkkk...",
      "....kkkKkkkk....",
    ],
    SKIRT_LEGS,
    { torso: "c" },
  ),
  darto: npc(
    // #bdbdbd #c28f63 #2d3a56 #b79b62
    { c: "#2d3a56", y: "#e6c35a", g: "#bdbdbd", s: "#c28f63", e: "#2a1a12", W: "#f0f0f0",
      u: "#b79b62", U: "#9a8050", B: "#2a2a2a", k: "#3a3d46", o: "#1b1b22" },
    [
      "....cccccccc....",
      "...cccccyyccc...",
      "...cccccccccc...",
      "..cccccccccccc..",
      "...gssssssssg...",
      "...gsessssesg...",
      "...gssssssssg...",
      "...sWWWWWWWWs...",
      "....ssssssss....",
      ".....ssssss.....",
      "..uuuuuuuuuuuu..",
      ".suuUUuuuuuuuus.",
      ".suuUUuuuuuuuus.",
      ".suuuuuuuuuuuus.",
      "..BBBBByyBBBBB..",
      "...kkkkkkkkkk...",
      "...kkkkkkkkkk...",
      "...kkkk..kkkk...",
      "...kkkk..kkkk...",
    ],
    PANTS_LEGS,
    { hair: "g", torso: "u", keep: "B" },
  ),
  yining: npc(
    // #1d1f2b #f5d8c4 #1f2a4d #a8322a
    { h: "#1d1f2b", H: "#3a3d4f", r: "#a8322a", s: "#f5d8c4", e: "#1d1f2b", b: "#e8a8a0", m: "#b5584a",
      n: "#1f2a4d", w: "#f3f0e8", y: "#e6c35a", k: "#2a2c38", K: "#1f2029", o: "#15161c" },
    [
      "....hhhhhh..r...",
      "...hhHHhhhhhrh..",
      "..hhhhhhhhhhhhh.",
      "..hhhhhhhhhhhhh.",
      "..hhhhhhhsssshh.",
      "..hsssssssssshh.",
      "..hseessssseehh.",
      "..hbssssssssbhh.",
      "..hssssmmsssshh.",
      "....ssssss...hh.",
      "..nnnwwrwwnnn.hh",
      ".nnnnwwrwwnnnnh.",
      ".synnnnnrnnnnns.",
      ".snnnnnnrnnnnns.",
      "..nnnnnnnnnnnn..",
      "...kkkkkkkkkk...",
      "...kKkKkKkKkk...",
      "...kkkkkkkkkk...",
      "....kkkkkkkk....",
    ],
    SKIRT_LEGS,
    { torso: "n", keep: "h" },
  ),
  ranran: {
    // Palet dari Character Sheet: #5b2f32 #f3cfb0 #f3f0e8 #3a3d46 #1b1b22
    palette: {
      h: "#5b2f32", H: "#7a4447", s: "#f3cfb0", e: "#1b1b22", b: "#e8a0a0", m: "#c94a3f",
      w: "#f3f0e8", t: "#1b1b22", k: "#3a3d46", K: "#2c2e36", g: "#c8ccd6", o: "#2a2026",
    },
    ...withLegs(ranranBody, { front: LEGS_FRONT, side: LEGS_SIDE }),
  },
};
