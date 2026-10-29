// Alur hari dan waktu.
//
// Tiap hari: { pagi, istirahat, pulang, malam }
//   slot:  { lokasi: { karakter: [scene...] }, intro?: "scene", start?: ["lokasi", [x, y]] }
//   malam: scene monolog Ranran di akhir hari (opsional)
// Entri karakter boleh { when, talk: [scene...] } kalau kehadirannya bersyarat.
//
// Saat NPC diajak bicara, scene pertama di daftar yang belum pernah diputar dan syaratnya
// terpenuhi yang diputar; kalau habis, obrolan ringan <karakter>_idle (data/story/idle.js).
// Scene `main: true` = obrolan utama: NPC diberi tanda "!" dan slot berakhir setelahnya.
// Atap terkunci sampai flag atap_terbuka (dari Pak Darto); lihat pintu di data/locations.js.
//
// Potongan rahasia untuk True Ending (semuanya obrolan opsional):
//   hao_tahu_pindah  Hao      H3 pulang (perpustakaan) / H5 istirahat (lapangan)   butuh hao_ragu (H1 pagi), courage ≥ 3
//   mei_berkas       Bu Mei   H3 istirahat (kelas) / H4 pagi (koridor)             butuh mei_nasihat (H2 pagi atau H3 pagi), courage ≥ 3
//   darto_atap       Pak Darto H4 pagi (gerbang) / H5 istirahat (atap)             butuh atap_terbuka
//   yining_tekanan   Yining   H4 istirahat (lapangan) / H4 pulang (gerbang) / H5 pagi (koridor)   butuh yining_kenal, courage ≥ 3

export const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

export const SLOTS = [
  { id: "pagi", name: "Pagi", start: ["gerbang", [2, 5]] },
  { id: "istirahat", name: "Istirahat", start: ["kelas", [5, 5]] },
  { id: "pulang", name: "Pulang", start: ["kelas", [5, 5]] },
];

export default {
  1: {
    pagi: {
      gerbang: { darto: ["d1_pagi_darto"] },
      koridor: { yining: ["d1_pagi_yining"] },
      kelas: { yuanyuan: ["d1_pagi_yuanyuan"], hao: ["d1_pagi_hao"] },
      perpustakaan: { bumei: ["d1_pagi_bumei"] },
    },
    istirahat: {
      intro: "d1_istirahat_intro",
      perpustakaan: { yuanyuan: ["d1_istirahat_yuanyuan"] },
      lapangan: { hao: ["d1_istirahat_hao"], yining: ["d1_istirahat_yining"] },
      kelas: { bumei: ["d1_istirahat_bumei"] },
    },
    pulang: {
      gerbang: { yuanyuan: ["d1_pulang_yuanyuan"], darto: ["d1_pulang_darto"] },
      koridor: { hao: ["d1_pulang_hao"] },
    },
    malam: "d1_malam",
  },
  2: {
    pagi: {
      gerbang: { darto: ["d2_pagi_darto_kenal", "d2_pagi_darto"] },
      koridor: { yuanyuan: ["d2_pagi_yuanyuan"] },
      kelas: { bumei: ["d2_pagi_bumei"], hao: ["d2_pagi_hao_slip", "d2_pagi_hao"] },
      lapangan: { yining: ["d2_pagi_yining_latihan", "d2_pagi_yining"] },
    },
    istirahat: {
      intro: "d2_istirahat_intro",
      perpustakaan: { yining: ["d2_istirahat_yining"] },
      koridor: { darto: ["d2_istirahat_darto"] },
      lapangan: { hao: ["d2_istirahat_hao"] },
    },
    pulang: {
      gerbang: { yuanyuan: ["d2_pulang_yuanyuan"] },
      kelas: { bumei: ["d2_pulang_bumei"] },
    },
    malam: "d2_malam",
  },
  3: {
    pagi: {
      gerbang: { darto: ["d3_pagi_darto_buka", "d3_pagi_darto"] },
      kelas: { yuanyuan: ["d3_pagi_yuanyuan"], yining: ["d3_pagi_yining_biola", "d3_pagi_yining"] },
      perpustakaan: { bumei: ["d3_pagi_bumei_nasihat", "d3_pagi_bumei"] },
    },
    istirahat: {
      atap: { yuanyuan: ["d3_istirahat_yuanyuan"] },
      lapangan: { hao: ["d3_istirahat_hao"] },
      kelas: { bumei: ["d3_istirahat_bumei_berkas", "d3_istirahat_bumei"] },
    },
    pulang: {
      koridor: { yining: ["d3_pulang_yining"] },
      gerbang: { yuanyuan: ["d3_pulang_yuanyuan"] },
      perpustakaan: { hao: ["d3_pulang_hao_jujur", "d3_pulang_hao"] },
    },
    malam: "d3_malam",
  },
  4: {
    pagi: {
      gerbang: { darto: ["d4_pagi_darto_cerita", "d3_pagi_darto_buka", "d4_pagi_darto"] },
      kelas: { hao: ["d4_pagi_hao"], yuanyuan: ["d4_pagi_yuanyuan"] },
      koridor: { bumei: ["d3_istirahat_bumei_berkas", "d4_pagi_bumei"] },
    },
    istirahat: {
      atap: { yuanyuan: ["d4_istirahat_yuanyuan"] },
      perpustakaan: { bumei: ["d4_istirahat_bumei"] },
      lapangan: { yining: ["d4_istirahat_yining_tekanan", "d4_istirahat_yining"] },
    },
    pulang: {
      kelas: { yuanyuan: ["d4_pulang_yuanyuan_jujur", "d4_pulang_yuanyuan"] },
      gerbang: { darto: ["d4_pulang_darto"], yining: ["d4_istirahat_yining_tekanan", "d4_pulang_yining"] },
    },
    malam: "d4_malam",
  },
  5: {
    pagi: {
      intro: "d5_pagi_intro",
      kelas: { yuanyuan: ["d5_pagi_yuanyuan"], hao: ["d5_pagi_hao"], bumei: ["d5_pagi_bumei"] },
      koridor: { yining: ["d4_istirahat_yining_tekanan", "d5_pagi_yining_saran", "d5_pagi_yining"] },
    },
    istirahat: {
      intro: "d5_istirahat_intro",
      atap: { yuanyuan: ["d5_istirahat_yuanyuan"], darto: ["d4_pagi_darto_cerita", "d5_istirahat_darto"] },
      lapangan: { hao: ["d5_istirahat_hao_jujur", "d5_istirahat_hao"], yining: ["d5_istirahat_yining"] },
    },
    pulang: {
      intro: "d5_pulang_intro",
      atap: { yuanyuan: { when: { flags: ["atap_terbuka"] }, talk: ["d5_pulang_yuanyuan"] } },
      gerbang: {
        yuanyuan: { when: { notFlags: ["atap_terbuka"] }, talk: ["d5_pulang_yuanyuan"] },
        darto: ["d5_pulang_darto"],
      },
    },
  },
};
