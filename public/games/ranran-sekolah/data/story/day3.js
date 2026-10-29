// HARI 3 — Rabu. Atap terbuka bagi yang dipercaya; potongan rahasia mulai bisa didapat.
export default {
  // Kesempatan membuka atap (juga dipakai Hari 4 pagi)
  d3_pagi_darto_buka: {
    when: { flags: ["darto_kenal"], notFlags: ["atap_terbuka"], min: { courage: 2 } },
    lines: [
      { who: "darto", text: "Neng. Dari kemarin saya lihat Neng mondar-mandir di bawah tangga atap." },
      { choice: [
        { text: "\"Pak, saya cuma mau ngobrol sama dia. Boleh?\"", add: { courage: 1 }, set: ["atap_terbuka"], goto: "darto_buka_atap" },
        { text: "\"Nggak kok, Pak.\"" },
      ] },
      { who: "darto", text: "Hmm. Kalau Neng berubah pikiran, saya di sini terus. Kayak tiang bendera." },
    ],
  },
  d3_pagi_darto: {
    lines: [
      { who: "darto", text: "Rabu. Hari tengah. Kata orang, kalau Rabu sudah lewat, minggu tinggal turunan." },
      { who: "darto", face: "senyum", text: "Kecuali minggu perpisahan. Minggu perpisahan itu tanjakan semua." },
      { choice: [
        { text: "\"Berarti kita semua lagi nanjak, Pak.\"", reply: [{ who: "darto", text: "Betul. Makanya jalannya pelan-pelan saja." }] },
        { text: "\"Filosofinya dalam juga, Pak.\"", reply: [{ who: "darto", text: "Saya ini penjaga sekolah, Neng. Sekolah kehidupan." }] },
      ] },
    ],
  },

  d3_pagi_yuanyuan: {
    main: true,
    lines: [
      { who: "yuanyuan", text: "Ran, ini catatan Kimia-ku. Lengkap sampai bab terakhir. Buat kamu." },
      { who: "ranran", text: "(Ujian sudah selesai minggu lalu. Buat apa catatan Kimia?)" },
      { choice: [
        { text: "\"Kok tumben dikasih semua?\"", add: { courage: 1 }, goto: "d3_pagi_yuanyuan_tanya" },
        { text: "\"Makasih, Yuan. Kamu selalu ngerti aku.\"", add: { trust: 1 }, goto: "d3_pagi_yuanyuan_makasih" },
        { text: "(Terima tanpa bilang apa-apa.)" },
      ] },
      { text: "Catatan itu terasa lebih berat dari kelihatannya." },
    ],
  },
  d3_pagi_yuanyuan_tanya: {
    lines: [
      { who: "yuanyuan", face: "senyum", text: "Biar kamu punya kenang-kenangan tulisanku yang jelek." },
      { who: "yuanyuan", text: "...Bercanda. Simpan aja, ya." },
    ],
  },
  d3_pagi_yuanyuan_makasih: {
    lines: [{ who: "yuanyuan", text: "Iya. Kamu juga selalu... baik-baik aja, kan." }],
  },

  d3_pagi_yining_biola: {
    when: { flags: ["yining_kenal"], min: { courage: 2 } },
    lines: [
      { who: "yining", text: "Song Xinran. Kamu pernah dipaksa berhenti dari sesuatu yang kamu suka?" },
      { who: "ranran", text: "Belum... kenapa?" },
      { who: "yining", text: "Aku dulu main biola. Sampai kelas 9. Lalu orang tuaku bilang biola tidak masuk rapor." },
      { who: "yining", text: "Lupakan. Aku cuma melihat seseorang yang wajahnya sama seperti aku waktu itu." },
      { choice: [
        { text: "\"Kamu masih suka biola?\"", reply: [{ who: "yining", text: "...Masih. Biolanya ada di bawah kasur. Kadang kubuka, kubersihkan, kututup lagi." }] },
        { text: "\"Maksudmu siapa?\"", reply: [{ who: "yining", text: "Kamu tahu siapa, Song Xinran." }] },
      ] },
    ],
  },
  d3_pagi_yining: {
    lines: [
      { who: "yining", text: "Formulirmu sudah masuk. Bagus. Tinggal tiga puluh satu orang lagi." },
      { choice: [
        { text: "\"Semangat, Ketua OSIS.\"", reply: [{ who: "yining", text: "Semangat tidak menyelesaikan formulir. Tapi... terima kasih." }] },
        { text: "\"Tiga puluh satu? Siapa saja?\"", reply: [{ who: "yining", text: "Hampir semua. Termasuk Hao. Terutama Hao." }] },
      ] },
    ],
  },

  d3_pagi_bumei_nasihat: {
    when: { notFlags: ["mei_nasihat"] },
    lines: [
      { who: "bumei", text: "Ranran. Sini sebentar. Kamu kelihatan seperti orang yang punya pertanyaan." },
      { choice: [
        { text: "\"Bu, kalau teman menyembunyikan sesuatu, kita harus gimana?\"", add: { courage: 1 }, set: ["mei_nasihat"], goto: "mei_nasihat_isi" },
        { text: "\"Nggak apa-apa, Bu.\"", goto: "mei_baik_saja" },
      ] },
    ],
  },
  d3_pagi_bumei: {
    lines: [
      { who: "bumei", face: "senyum", text: "Perpustakaan pagi-pagi itu tempat terbaik untuk berpikir. Atau tidur. Ibu tidak menghakimi." },
      { choice: [
        { text: "\"Saya pilih berpikir, Bu.\"", reply: [{ who: "bumei", text: "Pilihan bagus. Tidurnya nanti saja, di jam pelajaran Ibu. Bercanda." }] },
        { text: "\"Ibu sering ke sini?\"", reply: [{ who: "bumei", text: "Tiap pagi. Di sini tidak ada yang tanya nilai." }] },
      ] },
    ],
  },

  d3_istirahat_yuanyuan: {
    main: true,
    lines: [
      { text: "Pintu atap berderit. Yuanyuan duduk di dekat tandon air, kamera di pangkuannya." },
      { who: "yuanyuan", face: "kaget", text: "Ran? Kok bisa naik? ...Pak Darto, ya." },
      { who: "yuanyuan", text: "Dari sini kelihatan semuanya. Lapangan, gerbang, jalan ke stasiun." },
      { choice: [
        { text: "\"Ini tempat rahasiamu?\"", add: { trust: 1 }, goto: "d3_istirahat_yuanyuan_rahasia" },
        { text: "\"Kenapa kamu sering ke sini sendirian?\"", add: { courage: 1 }, goto: "d3_istirahat_yuanyuan_sendiri" },
      ] },
    ],
  },
  d3_istirahat_yuanyuan_rahasia: {
    lines: [
      { who: "yuanyuan", face: "senyum", text: "Iya. Sekarang jadi tempat rahasia kita." },
      { who: "yuanyuan", text: "Foto, yuk. Kamu jangan lihat kamera. Lihat langit aja." },
    ],
  },
  d3_istirahat_yuanyuan_sendiri: {
    lines: [
      { who: "yuanyuan", text: "Biar... latihan. Latihan sendirian." },
      { who: "ranran", text: "(Latihan buat apa?)" },
    ],
  },

  d3_istirahat_hao: {
    main: true,
    lines: [
      { who: "hao", face: "serius", text: "Ran. Pertanyaan serius dari ketua kelas yang biasanya tidak serius." },
      { who: "hao", text: "Kalau temanmu pergi jauh dan nggak pamit, kamu marah?" },
      { choice: [
        { text: "\"Aku bakal sedih, tapi aku ngerti.\"", add: { trust: 1 }, goto: "d3_istirahat_hao_ngerti" },
        { text: "\"Aku mau dia pamit. Langsung ke aku.\"", add: { courage: 1 }, goto: "d3_istirahat_hao_pamit" },
      ] },
    ],
  },
  d3_istirahat_hao_ngerti: {
    lines: [{ who: "hao", text: "...Kamu terlalu baik, Ran. Kadang orang perlu dimarahi biar tahu dia penting." }],
  },
  d3_istirahat_hao_pamit: {
    lines: [
      { who: "hao", text: "Bagus. Ingat jawaban itu." },
      { who: "hao", face: "senyum", text: "...Aku nggak bilang apa-apa, ya. Aku cuma nanya." },
    ],
  },

  // Potongan rahasia Bu Mei (juga dipakai Hari 4 pagi)
  d3_istirahat_bumei_berkas: {
    when: { flags: ["mei_nasihat"], notFlags: ["mei_berkas"], min: { courage: 3 } },
    lines: [
      { who: "bumei", text: "Ranran, tolong bawakan map-map ini ke ruang guru?" },
      { text: "Satu lembar terselip keluar. \"Surat Keterangan Pindah Sekolah — Fei Qinyuan. Tujuan: Malang.\"" },
      { who: "bumei", face: "kaget", text: "Ranran. Itu..." },
      { who: "bumei", text: "Ibu tidak boleh membicarakan data murid. Tapi Ibu juga tidak bisa pura-pura kamu tidak melihatnya." },
      { who: "bumei", text: "Dia berangkat Sabtu pagi. Neneknya sakit. Kalau mau bicara, bicaralah dengan dia. Bukan dengan Ibu." },
      { set: ["mei_berkas", "tahu_pindah"] },
      { choice: [
        { text: "\"Terima kasih sudah jujur, Bu.\"", reply: [{ who: "bumei", text: "Ibu yang terima kasih. Kamu yang harus berani setelah ini." }] },
        { text: "\"Saya... belum siap, Bu.\"", reply: [{ who: "bumei", text: "Tidak ada yang pernah siap. Tapi Sabtu tetap datang." }] },
      ] },
    ],
  },
  d3_istirahat_bumei: {
    lines: [
      { who: "bumei", text: "Ibu lagi menghitung kursi tamu. Selalu kurang satu. Atau lebih satu. Tergantung siapa yang menghitung." },
      { choice: [
        { text: "\"Biar saya bantu hitung, Bu.\"", reply: [{ who: "bumei", text: "Silakan. Kalau hasilnya beda lagi, kita anggap seni." }] },
        { text: "\"Kurang satu itu siapa, Bu?\"", reply: [{ who: "bumei", text: "...Mungkin ada yang tidak bisa datang. Sudah, Ibu salah hitung." }] },
      ] },
    ],
  },

  d3_pulang_yining: {
    main: true,
    lines: [
      { who: "yining", text: "Song Xinran. Pegang tangganya. Jangan dilepas." },
      { text: "Yining memasang spanduk \"Selamat Jalan, Angkatan Kita\" sendirian." },
      { choice: [
        { text: "\"Kenapa kamu ngurus semuanya sendirian?\"", add: { courage: 1 }, set: ["yining_kenal"], goto: "d3_pulang_yining_sendiri" },
        { text: "(Pegang tangganya erat-erat.)", add: { trust: 1 }, set: ["yining_kenal"], goto: "d3_pulang_yining_pegang" },
      ] },
    ],
  },
  d3_pulang_yining_sendiri: {
    lines: [
      { who: "yining", text: "Karena kalau aku yang salah, cuma aku yang dimarahi." },
      { who: "yining", text: "...Itu kalimat ibuku. Bukan kalimatku." },
    ],
  },
  d3_pulang_yining_pegang: {
    lines: [{ who: "yining", text: "Kamu pendiam, ya. Enak diajak kerja. Tidak banyak protes." }],
  },

  d3_pulang_yuanyuan: {
    main: true,
    lines: [
      { who: "yuanyuan", face: "senyum", text: "Ran. Hari ini nggak dijemput. Pulang bareng?" },
      { text: "Mereka berjalan sampai perempatan, seperti dulu." },
      { choice: [
        { text: "\"Yuan, kamu nyembunyiin sesuatu, kan?\"", add: { courage: 1 }, goto: "d3_pulang_yuanyuan_tanya" },
        { text: "(Jalan bareng tanpa bicara.)", add: { trust: 1 }, goto: "d3_pulang_yuanyuan_jalan" },
      ] },
    ],
  },
  d3_pulang_yuanyuan_tanya: {
    lines: [{ who: "yuanyuan", text: "...Kasih aku waktu, Ran. Sampai Jumat. Boleh?" }],
  },
  d3_pulang_yuanyuan_jalan: {
    lines: [
      { who: "yuanyuan", text: "Aku bakal kangen ini. Jalan sore begini." },
      { who: "ranran", text: "(Kangen? Kita kan ketemu tiap hari.)" },
    ],
  },

  // Potongan rahasia Hao (kesempatan kedua ada di Hari 5 istirahat)
  d3_pulang_hao_jujur: {
    when: { flags: ["hao_ragu"], notFlags: ["hao_tahu_pindah"], min: { courage: 3 } },
    lines: [
      { who: "hao", text: "Ran. Kamu nyari aku sampai perpustakaan. Berarti serius." },
      { choice: [
        { text: "\"Hao, kamu tahu sesuatu soal Yuanyuan. Tolong.\"", set: ["hao_tahu_pindah", "tahu_pindah"], goto: "hao_cerita" },
        { text: "\"Nggak jadi.\"" },
      ] },
      { who: "hao", face: "senyum", text: "Oke. Pintu ketua kelas selalu terbuka. Kecuali pas tidur siang." },
    ],
  },
  hao_cerita: {
    lines: [
      { who: "hao", face: "serius", text: "...Dia cerita ke aku minggu lalu. Dia pindah ke Malang. Sabtu pagi." },
      { who: "hao", text: "Dia minta aku janji nggak bilang ke kamu. Katanya, \"Ranran pasti baik-baik aja. Dia nggak butuh drama.\"" },
      { who: "hao", text: "Aku ingkar janji. Tapi menurutku dia salah soal kamu." },
      { who: "ranran", text: "(Nggak butuh... Dia pikir aku nggak butuh dia?)" },
    ],
  },
  d3_pulang_hao: {
    lines: [
      { who: "hao", text: "Perpustakaan sepi. Cocok buat ketua kelas yang lagi kabur dari tugas." },
      { choice: [
        { text: "\"Tugas apa yang kamu tinggal kabur?\"", reply: [{ who: "hao", text: "Laporan kas kelas. Kasnya minus. Semangatku ikut minus." }] },
        { text: "\"Aku nggak lihat kamu di sini.\"", reply: [{ who: "hao", text: "Kamu memang teman terbaik." }] },
      ] },
    ],
  },

  d3_malam: {
    lines: [
      { who: "ranran", when: { flags: ["tahu_pindah"] }, text: "(Malang. Sabtu pagi. Jadi itu jawabannya. Kardus, foto, catatan Kimia...)" },
      { who: "ranran", when: { notFlags: ["tahu_pindah"] }, text: "(\"Sampai Jumat,\" katanya. Kenapa Jumat? Apa yang terjadi setelah Jumat?)" },
      { who: "ranran", text: "(Dua hari lagi.)" },
    ],
  },
};
