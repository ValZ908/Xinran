// Enam lokasi sekolah. Tiap peta 20×11 petak (16 px). Arti huruf ada di src/art/tiles.js.
// doors: injak petak `at` → pindah ke lokasi `to`, muncul di petak `spawn`.
// spots: petak tempat tiap karakter berdiri kalau jadwal menaruhnya di lokasi ini.
// Pintu boleh punya `when` (syarat terbuka) dan `locked` (scene yang diputar kalau masih terkunci).

export default {
  kelas: {
    name: "Kelas 12",
    floor: "#c9a27a",
    map: [
      "##wwww##BBBBBB##ww##",
      "#..................#",
      "#.......kk.........#",
      "#..................#",
      "#..dd..dd..dd..dd..#",
      "#..................D",
      "#..dd..dd..dd..dd..#",
      "#..................#",
      "#..dd..dd..dd..dd..#",
      "#..................#",
      "####################",
    ],
    spots: { yuanyuan: [13, 3], hao: [4, 7], bumei: [10, 1], yining: [16, 9] },
    doors: [{ at: [19, 5], to: "koridor", spawn: [1, 5] }],
  },

  koridor: {
    name: "Koridor",
    floor: "#d8d2c4",
    map: [
      "                    ",
      "                    ",
      "######D#####S#######",
      "#ll.ll.......ll.ll.#",
      "#..................#",
      "D..................D",
      "#..................#",
      "##wwww##wwww##wwww##",
      "                    ",
      "                    ",
      "                    ",
    ],
    spots: { yining: [10, 5], hao: [15, 4], yuanyuan: [3, 4], bumei: [7, 4], darto: [16, 6] },
    doors: [
      { at: [0, 5], to: "kelas", spawn: [18, 5] },
      { at: [6, 2], to: "perpustakaan", spawn: [9, 9] },
      { at: [12, 2], to: "atap", spawn: [9, 8], when: { flags: ["atap_terbuka"] }, locked: "atap_terkunci" },
      { at: [19, 5], to: "lapangan", spawn: [1, 5] },
    ],
  },

  perpustakaan: {
    name: "Perpustakaan",
    floor: "#b08a62",
    map: [
      "##bbbbbb####bbbbbb##",
      "#..................#",
      "#.bbbb.bbbb.bbbb...#",
      "#..................#",
      "#.bbbb.bbbb.bbbb...#",
      "#..................#",
      "#...dddd....dddd...#",
      "#..................#",
      "#..k...............#",
      "#..................#",
      "#########D##########",
    ],
    spots: { bumei: [4, 8], yuanyuan: [12, 5], yining: [15, 8], hao: [8, 3] },
    doors: [{ at: [9, 10], to: "koridor", spawn: [6, 3] }],
  },

  atap: {
    name: "Atap Sekolah",
    floor: "#b8b8b0",
    map: [
      "rrrrrrrrrrrrrrrrrrrr",
      "r..................r",
      "r.............hhh..r",
      "r..nn.........hhh..r",
      "r..................r",
      "r..................r",
      "r..................r",
      "r..................r",
      "r..................r",
      "r......##S##.......r",
      "rrrrrrrrrrrrrrrrrrrr",
    ],
    spots: { yuanyuan: [16, 5], darto: [5, 6] },
    doors: [{ at: [9, 9], to: "koridor", spawn: [12, 3] }],
  },

  lapangan: {
    name: "Lapangan",
    floor: "#7fae5a",
    map: [
      "tttttttttttttttttttt",
      "t..................t",
      "t.pppppppppppppppp.t",
      "t.p..............p.t",
      "t.p..............p.t",
      "D.p..............p.D",
      "t.p..............p.t",
      "t.p..............p.t",
      "t.pppppppppppppppp.t",
      "t....nn........nn..t",
      "tttttttttttttttttttt",
    ],
    spots: { hao: [9, 5], yining: [14, 6], yuanyuan: [6, 4] },
    doors: [
      { at: [0, 5], to: "koridor", spawn: [18, 5] },
      { at: [19, 5], to: "gerbang", spawn: [1, 5] },
    ],
  },

  gerbang: {
    name: "Gerbang Sekolah",
    floor: "#7fae5a",
    map: [
      "tttttttttttttttttttt",
      "t..................t",
      "t.......####.......t",
      "t.......#ww#.......t",
      "t..................t",
      "Dppppppppp.........t",
      "t........p.........t",
      "t........p.........t",
      "t........p.........t",
      "t........p.........t",
      "tttttttGGGGGGttttttt",
    ],
    spots: { darto: [12, 6], yining: [5, 7], yuanyuan: [11, 4], hao: [14, 5] },
    doors: [{ at: [0, 5], to: "lapangan", spawn: [18, 5] }],
  },
};
