// HARI 4 — Kamis. Sehari sebelum perpisahan. Yuanyuan bertanya, dan Ranran harus memilih jujur atau "baik-baik aja".
export default {
  // Potongan rahasia Pak Darto (juga dipakai Hari 5 istirahat)
  d4_pagi_darto_cerita: {
    when: { flags: ["atap_terbuka"], notFlags: ["darto_atap"] },
    lines: [
      { who: "darto", text: "Neng. Sini duduk. Saya mau cerita yang kemarin-kemarin saya potong terus." },
      { who: "darto", text: "Dulu, lama sekali, ada murid yang suka ke atap. Sehari sebelum pindah, dia pamit. Ke saya. Di atap." },
      { who: "darto", text: "Ke sahabatnya? Tidak. Sahabatnya tahu dari papan pengumuman. Sampai sekarang mereka tidak pernah bicara lagi." },
      { who: "darto", text: "Saya selalu menyesal tidak bilang ke anak itu, \"Pamitnya jangan ke saya. Ke temanmu.\"" },
      { who: "darto", text: "Neng Fei sekarang naik ke atap tiap hari. Saya tidak mau menyesal dua kali." },
      { set: ["darto_atap"] },
      { choice: [
        { text: "\"Pak, saya nggak akan biarin itu terjadi lagi.\"", reply: [{ who: "darto", text: "Saya pegang kata-kata Neng." }] },
        { text: "\"Murid itu masih sering Bapak ingat?\"", reply: [{ who: "darto", text: "Tiap kali ada yang naik ke atap sendirian." }] },
      ] },
    ],
  },
  d4_pagi_darto: {
    lines: [
      { who: "darto", face: "senyum", text: "Besok perpisahan. Saya sudah setrika seragam. Seragam saya, bukan seragam Neng." },
      { choice: [
        { text: "\"Seragam Bapak pasti rapi.\"", reply: [{ who: "darto", text: "Saking rapinya, saya takut duduk." }] },
        { text: "\"Bapak ikut sedih besok?\"", reply: [{ who: "darto", text: "Tiap tahun saya bilang nggak. Tiap tahun saya bohong." }] },
      ] },
    ],
  },

  d4_pagi_hao: {
    main: true,
    lines: [
      { who: "hao", when: { flags: ["pesan_kelas"] }, face: "senyum", text: "Latihan baca pesan kelas! Coba, Ran, bacakan kalimat pertamamu." },
      { who: "hao", when: { notFlags: ["pesan_kelas"] }, face: "senyum", text: "Pesan kelas sudah kutulis. Isinya 80% lelucon, 20% lelucon juga. Mau dengar?" },
      { choice: [
        { text: "\"Aku mau yang jujur, bukan yang aman.\"", add: { courage: 1 }, goto: "d4_pagi_hao_jujur" },
        { text: "\"Yang lucu aja, biar nggak ada yang nangis.\"", add: { trust: 1 }, goto: "d4_pagi_hao_lucu" },
      ] },
    ],
  },
  d4_pagi_hao_jujur: {
    lines: [{ who: "hao", text: "Itu dia. Itu yang kutunggu dari kemarin." }],
  },
  d4_pagi_hao_lucu: {
    lines: [{ who: "hao", face: "senyum", text: "Boleh. Tapi kalau tetap ada yang nangis, itu bukan salah kita." }],
  },

  d4_pagi_yuanyuan: {
    main: true,
    lines: [
      { text: "Yuanyuan sedang menulis di buku kenangan kelas." },
      { choice: [
        { text: "\"Tulis kesan buat aku juga, ya.\"", add: { trust: 1 }, goto: "d4_pagi_yuanyuan_kesan" },
        { text: "\"Kok kamu nulis 'sampai jumpa', bukan 'sampai besok'?\"", add: { courage: 1 }, goto: "d4_pagi_yuanyuan_jumpa" },
      ] },
    ],
  },
  d4_pagi_yuanyuan_kesan: {
    lines: [
      { who: "yuanyuan", face: "senyum", text: "Udah. Tapi baru boleh dibaca Sabtu." },
      { who: "ranran", text: "(Sabtu? Kenapa Sabtu?)" },
    ],
  },
  d4_pagi_yuanyuan_jumpa: {
    lines: [
      { who: "yuanyuan", text: "Ya... sama aja, kan, Ran?" },
      { who: "ranran", text: "(Nggak sama.)" },
    ],
  },

  d4_pagi_bumei: {
    lines: [
      { who: "bumei", face: "senyum", text: "Besok Ibu pakai kebaya. Jangan ada yang ketawa. Terutama Hao." },
      { choice: [
        { text: "\"Saya jagain biar Hao nggak ketawa, Bu.\"", reply: [{ who: "bumei", text: "Terima kasih. Ibu tahu bisa mengandalkanmu." }] },
        { text: "\"Kebayanya warna apa, Bu?\"", reply: [{ who: "bumei", text: "Rahasia. Pokoknya bukan warna nilai merah." }] },
      ] },
    ],
  },

  d4_istirahat_yuanyuan: {
    main: true,
    lines: [
      { text: "Angin di atap lebih kencang hari ini." },
      { who: "yuanyuan", text: "Ran. Aku mau nanya, dan kamu jawab jujur, ya." },
      { who: "yuanyuan", text: "Kalau... misalnya aku nggak ada. Kamu bakal baik-baik aja, kan?" },
      { choice: [
        { text: "\"Iya. Aku baik-baik aja, kok.\"", add: { courage: -1 }, set: ["bilang_baik"], goto: "d4_istirahat_yuanyuan_baik" },
        { text: "\"Kenapa kamu nanya begitu?\"", add: { courage: 1 }, goto: "d4_istirahat_yuanyuan_kenapa" },
        { text: "\"Nggak. Aku nggak akan baik-baik aja.\"", when: { min: { courage: 4 } }, add: { trust: 1, courage: 1 }, goto: "d4_istirahat_yuanyuan_jujur" },
      ] },
    ],
  },
  d4_istirahat_yuanyuan_baik: {
    lines: [
      { who: "yuanyuan", text: "...Iya. Aku tahu. Kamu selalu baik-baik aja." },
      { who: "ranran", text: "(Kenapa dia kelihatan lega dan sedih sekaligus?)" },
    ],
  },
  d4_istirahat_yuanyuan_kenapa: {
    lines: [{ who: "yuanyuan", text: "Nggak apa-apa. Lupain, ya." }],
  },
  d4_istirahat_yuanyuan_jujur: {
    lines: [
      { who: "yuanyuan", face: "kaget", text: "...Oh." },
      { who: "yuanyuan", text: "Aku nggak nyangka kamu bakal bilang gitu." },
      { text: "Yuanyuan memalingkan wajah. Bahunya sedikit gemetar." },
    ],
  },

  d4_istirahat_bumei: {
    main: true,
    lines: [
      { who: "bumei", text: "Ranran. Duduk. Ibu mau minta tolong yang bukan soal berkas." },
      { who: "bumei", text: "Besok, kalau ada yang ingin kamu katakan ke seseorang, katakan. Penyesalan itu lebih berat dari rasa malu." },
      { choice: [
        { text: "\"Bu, gimana caranya bilang hal yang susah?\"", add: { courage: 1 }, goto: "d4_istirahat_bumei_caranya" },
        { text: "\"Terima kasih sudah sabar sama kami, Bu.\"", add: { trust: 1 }, goto: "d4_istirahat_bumei_makasih" },
      ] },
    ],
  },
  d4_istirahat_bumei_caranya: {
    lines: [{ who: "bumei", text: "Pelan-pelan. Kalimat pertama yang paling berat. Setelah itu, biasanya mengalir." }],
  },
  d4_istirahat_bumei_makasih: {
    lines: [{ who: "bumei", face: "senyum", text: "Kalian juga sabar sama Ibu. Itu impas." }],
  },

  // Potongan rahasia Yining (juga dipakai Hari 4 pulang dan Hari 5 pagi)
  d4_istirahat_yining_tekanan: {
    when: { flags: ["yining_kenal"], notFlags: ["yining_tekanan"], min: { courage: 3 } },
    lines: [
      { who: "yining", text: "Song Xinran. Kamu ke sini mau nanya soal Fei Qinyuan, kan. Wajahmu kelihatan." },
      { choice: [
        { text: "\"Iya. Tolong, Yining.\"", set: ["yining_tekanan"], goto: "yining_cerita" },
        { text: "\"Nggak, cuma lewat.\"" },
      ] },
      { who: "yining", text: "Baik. Lewat saja." },
    ],
  },
  yining_cerita: {
    lines: [
      { who: "yining", text: "Surat pengunduran dirinya dari klub ada di meja OSIS. Yang tanda tangan orang tuanya, bukan dia." },
      { who: "yining", text: "Orang tuanya minta dia fokus bantu keluarga. Itu bukan pilihannya, dan dia tidak mau ada yang kasihan." },
      { who: "yining", text: "Aku tahu rasanya. Kamu tersenyum supaya orang tuamu tidak merasa bersalah, lalu menangis di tempat lain." },
      { who: "yining", text: "Kalau dia menjauh darimu, mungkin itu caranya supaya tidak menangis di depanmu." },
    ],
  },
  d4_istirahat_yining: {
    lines: [
      { who: "yining", text: "Panggung sudah sembilan puluh persen. Sisanya sepuluh persen yang selalu paling lama." },
      { choice: [
        { text: "\"Sepuluh persen terakhir bisa kubantu?\"", reply: [{ who: "yining", text: "Bisa. Pegang ujung pita ini. Jangan bergerak sampai aku bilang." }] },
        { text: "\"Istirahat dulu, Yining.\"", reply: [{ who: "yining", text: "Besok. Setelah semuanya selesai. Mungkin." }] },
      ] },
    ],
  },

  d4_pulang_yuanyuan_jujur: {
    main: true,
    when: { min: { trust: 3 } },
    lines: [
      { text: "Kelas sudah kosong. Yuanyuan menunggu di kursi Ranran." },
      { who: "yuanyuan", when: { notFlags: ["tahu_pindah"] }, text: "Ran. Aku harus bilang sesuatu. Sabtu pagi aku pindah ke Malang." },
      { who: "yuanyuan", when: { flags: ["tahu_pindah"] }, text: "Ran... dari mukamu, kayaknya kamu sudah tahu, ya. Iya. Sabtu pagi aku pindah ke Malang." },
      { who: "yuanyuan", text: "Nenekku sakit. Kami harus jaga beliau, sekalian ngurus toko keluarga di sana." },
      { set: ["tahu_pindah"] },
      { choice: [
        { text: "\"Kenapa baru bilang sekarang?\"", add: { courage: 1 }, goto: "d4_pulang_yuanyuan_kenapa" },
        { text: "\"Malang... jauh, ya.\"", add: { trust: 1 }, goto: "d4_pulang_yuanyuan_jauh" },
        { text: "\"Oh. Nggak apa-apa kok.\"", add: { courage: -1 }, set: ["bilang_baik"], goto: "d4_pulang_yuanyuan_baik" },
      ] },
    ],
  },
  d4_pulang_yuanyuan_kenapa: {
    lines: [{ who: "yuanyuan", text: "Karena aku takut minggu terakhir kita jadi sedih semua. Aku egois, ya." }],
  },
  d4_pulang_yuanyuan_jauh: {
    lines: [{ who: "yuanyuan", face: "senyum", text: "Jauh. Tapi ada kereta. Ada telepon. Dan ada... kamu, kalau kamu masih mau." }],
  },
  d4_pulang_yuanyuan_baik: {
    lines: [{ who: "yuanyuan", text: "...Iya. Aku tahu kamu bakal bilang gitu." }],
  },
  d4_pulang_yuanyuan: {
    main: true,
    lines: [
      { who: "yuanyuan", text: "Ran, aku... besok aja, ya. Habis acara. Aku janji." },
      { who: "ranran", text: "(Besok. Besok itu hari terakhir.)" },
    ],
  },

  d4_pulang_darto: {
    main: true,
    lines: [
      { who: "darto", when: { flags: ["atap_terbuka"] }, text: "Neng. Besok setelah acara bubar, pintu atap saya buka. Saya tidak akan naik. Itu urusan anak muda." },
      { who: "darto", when: { notFlags: ["atap_terbuka"] }, text: "Neng Ranran. Besok hari terakhir. Ada yang mau Neng minta dari saya?" },
      { choice: [
        { text: "\"Pak, besok saya harus ngomong sama dia. Di atap.\"", when: { notFlags: ["atap_terbuka"], min: { courage: 2 } }, add: { courage: 1 }, set: ["atap_terbuka"], goto: "darto_buka_atap" },
        { text: "\"Terima kasih, Pak. Untuk semuanya.\"", add: { trust: 1 }, goto: "d4_pulang_darto_makasih" },
        { text: "\"Nggak ada, Pak.\"" },
      ] },
      { who: "darto", text: "Ya sudah, Neng. Istirahat yang cukup." },
    ],
  },
  d4_pulang_darto_makasih: {
    lines: [{ who: "darto", face: "senyum", text: "Sama-sama, Neng. Saya cuma jaga gerbang. Yang jaga perasaan itu tugas Neng sendiri." }],
  },

  d4_pulang_yining: {
    lines: [
      { who: "yining", text: "Besok jam tujuh. Jangan terlambat. Aku sudah hafal semua alasan terlambat." },
      { choice: [
        { text: "\"Alasan terlambat paling aneh apa?\"", reply: [{ who: "yining", text: "\"Dikejar angsa.\" Dan ternyata benar." }] },
        { text: "\"Siap, Ketua.\"", reply: [{ who: "yining", text: "Bagus." }] },
      ] },
    ],
  },

  d4_malam: {
    lines: [
      { who: "ranran", when: { flags: ["tahu_pindah"] }, text: "(Malang. Sabtu pagi. Besok hari terakhir aku bisa ketemu dia tiap hari.)" },
      { who: "ranran", when: { notFlags: ["tahu_pindah"] }, text: "(Besok hari terakhir sebelum... sebelum apa? Aku bahkan belum tahu.)" },
      { who: "ranran", when: { flags: ["bilang_baik"] }, text: "(Aku bilang aku baik-baik aja. Lagi. Kenapa sih aku selalu bilang begitu?)" },
      { who: "ranran", text: "(Besok. Apa pun yang terjadi, besok aku harus bilang sesuatu yang benar.)" },
    ],
  },
};
