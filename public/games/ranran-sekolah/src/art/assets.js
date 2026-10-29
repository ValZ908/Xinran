// Satu titik untuk aset final. Taruh file di public/ lalu daftarkan di sini;
// placeholder dari kode otomatis diganti tanpa menyentuh logika game.

// Spritesheet 48×96 px = 3 frame (kolom) × 4 arah (baris: bawah, atas, kiri, kanan), tiap frame 16×24.
export const SPRITE_PNG = {
  // ranran: "/sprites/ranran.png",
};

// Portrait dialog 48×48. Kunci "id" untuk wajah default, "id_ekspresi" untuk ekspresi
// (sesuai `face` di data cerita), misalnya yuanyuan_sedih.
// Musik (diputar berulang). Id yang dipanggil game:
//   menu · sekolah · malam · ending_true · ending_happy · ending_sad
export const MUSIC = {
  // sekolah: "/audio/sekolah.mp3",
};

// Efek suara. Id yang dipanggil game: pilih (pindah opsi) · ok (konfirmasi) · pintu · ketik (huruf dialog)
export const SFX = {
  // pintu: "/audio/pintu.wav",
};

export const PORTRAIT_PNG = {
  // yuanyuan: "/portraits/yuanyuan.png",
  // yuanyuan_sedih: "/portraits/yuanyuan_sedih.png",
};
