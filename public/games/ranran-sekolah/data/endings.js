// Ending dicek berurutan di akhir Hari 5; yang pertama cocok dipakai. Yang terakhir tanpa syarat = cadangan.
// scene: penutup (epilog Sabtu pagi), ada di data/story/day5.js.
//
// Flag kunci:
//   tahu_pindah     Ranran tahu Yuanyuan pindah sebelum percakapan terakhir (lapisan 1)
//   berbaikan       Ranran jujur bertanya, bukan bilang "nggak apa-apa", di percakapan terakhir
//   jujur_butuh     Ranran bilang dia butuh Yuanyuan (lapisan 2). Opsi ini hanya muncul kalau
//                   keempat potongan rahasia terkumpul: hao_tahu_pindah, mei_berkas, darto_atap,
//                   yining_tekanan, dan courage ≥ 5.
export default [
  {
    id: "true",
    title: "Yang Akhirnya Diucapkan",
    scene: "ending_true",
    when: { flags: ["jujur_butuh"], min: { trust: 6, courage: 5 } },
  },
  {
    id: "happy",
    title: "Sampai Jumpa di Malang",
    scene: "ending_happy",
    when: { flags: ["berbaikan", "tahu_pindah"], min: { trust: 4, courage: 3 } },
  },
  {
    id: "sad",
    title: "Kursi yang Kosong",
    scene: "ending_sad",
  },
];
