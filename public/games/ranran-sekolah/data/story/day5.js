// HARI 5 — Jumat. Hari perpisahan. Pagi–istirahat: acara. Pulang: percakapan terakhir.
// Ending (scene penutup Sabtu pagi) ada di bawah; syaratnya di data/endings.js.
export default {
  d5_pagi_intro: {
    lines: [{ text: "Hari perpisahan. Lapangan penuh kursi lipat, balon, dan orang tua yang memotret segalanya." }],
  },

  d5_pagi_bumei: {
    main: true,
    lines: [
      { who: "bumei", face: "senyum", text: "Ranran, sini. Ibu sematkan bunga di seragammu. Diam sebentar. Jangan tegang, nanti bunganya ikut tegang." },
      { choice: [
        { text: "\"Makasih, Bu. Untuk tiga tahun ini.\"", add: { trust: 1 }, goto: "d5_pagi_bumei_makasih" },
        { text: "\"Bu, hari ini saya mau jujur ke seseorang.\"", add: { courage: 1 }, goto: "d5_pagi_bumei_jujur" },
      ] },
    ],
  },
  d5_pagi_bumei_makasih: {
    lines: [{ who: "bumei", text: "Tiga tahun yang cepat sekali, ya. Ibu masih ingat kalian waktu masih takut sama tangga ke lantai dua." }],
  },
  d5_pagi_bumei_jujur: {
    lines: [{ who: "bumei", face: "senyum", text: "Bagus. Ibu doakan kalimat pertamanya lancar." }],
  },

  d5_pagi_yuanyuan: {
    main: true,
    lines: [
      { who: "yuanyuan", face: "senyum", text: "Ran! Foto bareng sebelum acara, yuk. Pakai kameraku." },
      { choice: [
        { text: "\"Yuk. Yang ini jangan dicopot dari mana-mana, ya.\"", add: { trust: 1 }, goto: "d5_pagi_yuanyuan_foto" },
        { text: "\"Habis acara, aku mau ngomong sesuatu.\"", add: { courage: 1 }, goto: "d5_pagi_yuanyuan_ngomong" },
      ] },
    ],
  },
  d5_pagi_yuanyuan_foto: {
    lines: [{ who: "yuanyuan", text: "...Nggak akan. Janji." }],
  },
  d5_pagi_yuanyuan_ngomong: {
    lines: [{ who: "yuanyuan", text: "Aku juga, Ran. Habis acara." }],
  },

  d5_pagi_hao: {
    lines: [
      { who: "hao", text: "Aku gugup. Ketua kelas juga bisa gugup. Tolong pura-pura nggak lihat lututku." },
      { choice: [
        { text: "\"Lutut? Aku nggak lihat apa-apa.\"", reply: [{ who: "hao", text: "Terima kasih. Kamu sudah menyelamatkan martabat ketua kelas." }] },
        { text: "\"Kamu pasti bisa, Hao.\"", reply: [{ who: "hao", text: "Kalau aku pingsan di panggung, bilang itu bagian dari pertunjukan." }] },
      ] },
    ],
  },

  d5_pagi_yining_saran: {
    when: { flags: ["yining_tekanan"] },
    lines: [
      { who: "yining", text: "Song Xinran. Kalau kamu mau bilang sesuatu ke dia, jangan tunggu waktu yang tepat." },
      { who: "yining", text: "Waktu yang tepat itu mitos panitia." },
      { choice: [
        { text: "\"Makasih, Yining.\"", reply: [{ who: "yining", text: "Jangan berterima kasih. Lakukan saja." }] },
        { text: "\"Kamu sendiri juga, ya.\"", reply: [{ who: "yining", text: "...Mungkin. Ke ibuku. Setelah acara." }] },
      ] },
    ],
  },
  d5_pagi_yining: {
    lines: [
      { who: "yining", text: "Sepuluh menit lagi. Kalau ada yang mau menangis, nanti saja, setelah dokumentasi." },
      { choice: [
        { text: "\"Siap. Nangisnya nanti.\"", reply: [{ who: "yining", text: "Bagus. Aku juga." }] },
        { text: "\"Kamu sendiri sudah siap?\"", reply: [{ who: "yining", text: "Tidak. Tapi tidak ada yang perlu tahu." }] },
      ] },
    ],
  },

  d5_istirahat_intro: {
    lines: [
      { text: "Acara selesai lebih lama dari jadwal. Tentu saja." },
      { when: { flags: ["pesan_kelas"] }, text: "Ranran membacakan pesan kelas. Suaranya bergetar di kalimat pertama, lalu tidak lagi." },
      { when: { notFlags: ["pesan_kelas"] }, text: "Hao membacakan pesan kelas. Setengahnya lelucon. Setengahnya membuat semua orang diam." },
    ],
  },

  d5_istirahat_yining: {
    main: true,
    lines: [
      { who: "yining", text: "Pidatoku selesai. Tidak ada kata yang salah." },
      { choice: [
        { text: "\"Pidatomu bagus. Beneran.\"", add: { trust: 1 }, goto: "d5_istirahat_yining_bagus" },
        { text: "\"Kamu sendiri, gimana perasaanmu?\"", add: { courage: 1 }, goto: "d5_istirahat_yining_perasaan" },
      ] },
    ],
  },
  d5_istirahat_yining_bagus: {
    lines: [{ who: "yining", text: "...Ibuku bilang \"lumayan\". Tapi aku dengar dia tepuk tangan paling keras." }],
  },
  d5_istirahat_yining_perasaan: {
    lines: [{ who: "yining", text: "Lega. Dan sedikit ingin main biola lagi. Jangan bilang siapa-siapa." }],
  },

  // Kesempatan kedua untuk potongan rahasia Hao
  d5_istirahat_hao_jujur: {
    when: { flags: ["hao_ragu"], notFlags: ["hao_tahu_pindah"], min: { courage: 3 } },
    lines: [
      { who: "hao", face: "serius", text: "Ran. Acaranya sudah selesai. Dan aku nggak tahan lagi pura-pura bodoh." },
      { choice: [
        { text: "\"Hao, kamu tahu sesuatu soal Yuanyuan. Tolong.\"", set: ["hao_tahu_pindah", "tahu_pindah"], goto: "hao_cerita" },
        { text: "\"Nanti aja, Hao.\"" },
      ] },
      { who: "hao", text: "Oke. Tapi jangan kelamaan, Ran." },
    ],
  },
  d5_istirahat_hao: {
    lines: [
      { who: "hao", face: "senyum", text: "Pesan kelas sudah dibacakan. Aku masih hidup. Prestasi." },
      { choice: [
        { text: "\"Acaranya bagus, Hao.\"", reply: [{ who: "hao", text: "Iya, kan? Aku cuma nyumbang tepuk tangan, tapi tepuk tangannya bagus." }] },
        { text: "\"Kamu nangis tadi?\"", reply: [{ who: "hao", text: "Debu panggung, Ran. Debu panggung." }] },
      ] },
    ],
  },

  d5_istirahat_yuanyuan: {
    main: true,
    lines: [
      { text: "Dari atap, kursi-kursi di lapangan terlihat seperti barisan kecil." },
      { who: "yuanyuan", text: "Ran. Nanti sore, setelah semua bubar... ketemu, ya?" },
      { choice: [
        { text: "\"Iya. Aku pasti datang.\"", add: { trust: 1 } },
        { text: "\"Aku tahu kamu mau pergi, Yuan.\"", when: { flags: ["tahu_pindah"] }, add: { courage: 1 }, goto: "d5_istirahat_yuanyuan_tahu" },
        { text: "(Mengangguk pelan.)" },
      ] },
      { who: "yuanyuan", face: "senyum", text: "Oke. Nanti sore." },
    ],
  },
  d5_istirahat_yuanyuan_tahu: {
    lines: [{ who: "yuanyuan", text: "...Nanti sore, aku cerita semuanya. Janji." }],
  },

  d5_istirahat_darto: {
    lines: [
      { who: "darto", text: "Saya cuma ngecek pintu. Bukan nguping. Saya penjaga yang profesional." },
      { choice: [
        { text: "\"Profesional sekali, Pak.\"", reply: [{ who: "darto", text: "Sudah dua puluh tahun. Menguping itu bukan hobi, itu bakat." }] },
        { text: "\"Makasih sudah bukain pintunya, Pak.\"", reply: [{ who: "darto", text: "Pintu itu cuma pintu, Neng. Yang buka hati ya Neng sendiri." }] },
      ] },
    ],
  },

  d5_pulang_intro: {
    lines: [
      { text: "Keramaian bubar. Kursi dilipat satu per satu. Ini kesempatan terakhir." },
      { when: { flags: ["atap_terbuka"] }, text: "Pintu atap terbuka. Kata Pak Darto, Yuanyuan sudah naik duluan." },
      { when: { notFlags: ["atap_terbuka"] }, text: "Yuanyuan menunggu di gerbang." },
    ],
  },

  d5_pulang_darto: {
    lines: [
      { who: "darto", when: { flags: ["atap_terbuka"] }, text: "Dia di atas, Neng. Sudah dari tadi." },
      { who: "darto", when: { notFlags: ["atap_terbuka"] }, text: "Neng Fei di sini dari tadi. Nunggu Neng, kelihatannya." },
      { choice: [
        { text: "\"Doain saya, Pak.\"", reply: [{ who: "darto", text: "Sudah, Neng. Dari Senin." }] },
        { text: "\"Pak, saya takut.\"", reply: [{ who: "darto", text: "Bagus. Berarti Neng peduli. Sana." }] },
      ] },
    ],
  },

  // Percakapan terakhir. Ending ditentukan setelah scene ini (data/endings.js).
  d5_pulang_yuanyuan: {
    main: true,
    lines: [
      { text: "Langit sore berwarna oranye. Yuanyuan memegang kamera, tapi tidak memotret apa-apa." },
      { who: "yuanyuan", when: { flags: ["tahu_pindah"] }, text: "Kamu sudah tahu, ya. Soal Malang." },
      { who: "yuanyuan", when: { notFlags: ["tahu_pindah"] }, text: "Ran... besok pagi aku pindah ke Malang. Nenekku sakit. Maaf baru bilang sekarang." },
      { who: "ranran", when: { notFlags: ["tahu_pindah"] }, text: "(Besok... pagi? Hari ini hari terakhir, dan aku baru tahu sekarang?)" },
      { who: "yuanyuan", text: "Aku nggak cerita karena... kamu selalu bilang nggak apa-apa. Kamu nggak pernah minta tolong." },
      { who: "yuanyuan", text: "Aku pikir kamu bakal baik-baik aja tanpa aku. Jadi aku latihan pergi duluan. Biar nggak sakit buat kita berdua." },
      { choice: [
        { text: "\"Iya... aku baik-baik aja kok. Hati-hati di sana.\"", add: { courage: -2 } },
        { text: "\"Kenapa nggak cerita dari awal? Aku sahabatmu, Yuan.\"", when: { flags: ["tahu_pindah"] }, add: { courage: 1 }, set: ["berbaikan"] },
        {
          text: "\"Aku nggak baik-baik aja. Aku butuh kamu. Aku cuma nggak pernah berani bilang.\"",
          when: { flags: ["hao_tahu_pindah", "mei_berkas", "darto_atap", "yining_tekanan"], min: { courage: 5 } },
          set: ["berbaikan", "jujur_butuh"],
        },
        { text: "(Diam. Tenggorokan Ranran tercekat.)", when: { notFlags: ["tahu_pindah"] } },
      ] },
      { who: "yuanyuan", when: { flags: ["jujur_butuh"] }, face: "kaget", text: "...Ran." },
      { who: "yuanyuan", when: { flags: ["jujur_butuh"] }, text: "Selama ini aku pikir cuma aku yang bakal kehilangan. Kamu nggak." },
      { who: "ranran", when: { flags: ["jujur_butuh"] }, text: "Aku juga takut. Aku bilang nggak apa-apa karena takut jadi beban. Sama kayak kamu." },
      { who: "yuanyuan", when: { flags: ["jujur_butuh"] }, face: "senyum", text: "Kita bodoh, ya. Dua-duanya." },
      { when: { flags: ["jujur_butuh"] }, text: "Mereka tertawa sambil menangis. Untuk pertama kalinya minggu ini, tidak ada yang pura-pura." },
      { who: "yuanyuan", when: { flags: ["berbaikan"], notFlags: ["jujur_butuh"] }, text: "Maaf, Ran. Aku takut. Tapi aku salah nggak cerita." },
      { who: "ranran", when: { flags: ["berbaikan"], notFlags: ["jujur_butuh"] }, text: "Aku nggak marah. Aku cuma mau ada di minggu terakhirmu." },
      { who: "yuanyuan", when: { flags: ["berbaikan"], notFlags: ["jujur_butuh"] }, face: "senyum", text: "Kamu ada kok. Dari tadi." },
      { who: "yuanyuan", when: { notFlags: ["berbaikan"] }, text: "...Iya. Kamu memang selalu baik-baik aja." },
      { when: { notFlags: ["berbaikan"] }, text: "Yuanyuan tersenyum. Senyum yang sama seperti hari Senin. Senyum yang sudah berlatih pergi." },
    ],
  },

  ending_true: {
    lines: [
      { text: "Sabtu pagi. Stasiun masih sepi. Ranran datang membawa foto dari atap." },
      { who: "yuanyuan", face: "senyum", text: "Kamu datang." },
      { who: "ranran", text: "Aku janji bilang hal yang benar. Ini: aku bakal kangen kamu. Banyak. Dan aku bakal nelepon tiap minggu." },
      { who: "yuanyuan", face: "senyum", text: "Aku kirim foto langit Malang. Kamu kirim foto kursi sebelahmu, biar aku tahu nggak ada yang gantiin." },
      { text: "Kereta berangkat. Ranran melambai sampai keretanya hilang. Dia tidak bilang \"nggak apa-apa\"." },
      { who: "ranran", text: "(Aku nggak baik-baik aja. Dan ternyata, itu nggak apa-apa.)" },
    ],
  },
  ending_happy: {
    lines: [
      { text: "Sabtu pagi. Ranran mengantar Yuanyuan sampai mobil yang penuh kardus." },
      { who: "yuanyuan", text: "Telepon aku, ya. Jangan cuma bilang \"aman\" tiap ditanya." },
      { who: "ranran", text: "Iya. Hati-hati, Yuan." },
      { text: "Mobil itu menghilang di tikungan. Mereka sudah berbaikan. Tapi ada sesuatu yang belum sempat dikatakan, dan Ranran belum tahu apa." },
      { who: "ranran", text: "(Mungkin lain kali. Kalau aku sudah lebih berani.)" },
    ],
  },
  ending_sad: {
    lines: [
      { text: "Sabtu pagi. Ranran bangun terlambat." },
      { text: "Di ponselnya ada satu pesan dari Yuanyuan: \"Aku berangkat. Jaga diri, ya. Kamu pasti baik-baik aja.\"" },
      { who: "ranran", text: "(Aku membalas \"iya\". Seperti biasa.)" },
      { text: "Senin berikutnya, kursi di sebelah Ranran kosong. Kali ini, tidak ada yang akan kembali duduk di sana." },
    ],
  },
};
