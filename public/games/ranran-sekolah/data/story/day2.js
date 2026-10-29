// HARI 2 — Selasa. Petunjuk mulai berserakan: foto dicopot, nama dicoret, kardus di mobil.
export default {
  d2_pagi_darto_kenal: {
    when: { flags: ["darto_kenal"] },
    lines: [
      { who: "darto", text: "Neng Ranran. Kemarin nanya soal atap, kan? Saya kepikiran semalam." },
      { who: "darto", text: "Temanmu itu, Neng Fei. Dia suka naik ke atas kalau istirahat. Saya yang bukain. Katanya mau motret langit." },
      { who: "darto", face: "kaget", text: "Eh. Itu rahasia, ya. Saya lupa kalau itu rahasia." },
      { choice: [
        { text: "\"Tenang, Pak. Rahasia aman.\"", reply: [{ who: "darto", text: "Terima kasih, Neng. Saya juga simpan rahasia Neng. Kalau Neng punya." }] },
        { text: "\"Dia sering ke atas sendirian, Pak?\"", reply: [{ who: "darto", text: "Hampir tiap hari. Motret langit, katanya. Tapi lebih sering melamun." }] },
      ] },
    ],
  },
  d2_pagi_darto: {
    when: { notFlags: ["darto_kenal"] },
    lines: [
      { who: "darto", face: "senyum", text: "Pagi, Neng! Melamun lagi? Gerbang ini sudah hafal muka Neng." },
      { choice: [
        { text: "\"Pak, atap itu kenapa dikunci?\"", add: { courage: 1 }, set: ["darto_kenal"], goto: "darto_tanya_atap" },
        { text: "\"Pagi, Pak.\"" },
      ] },
      { who: "darto", text: "Pagi juga. Semangat, Neng. Tinggal empat hari." },
    ],
  },

  d2_pagi_yuanyuan: {
    main: true,
    lines: [
      { text: "Di papan klub fotografi, Yuanyuan mencabuti foto-fotonya satu per satu." },
      { who: "ranran", text: "(Itu foto study tour kita. Aku yang megang payung, dia yang basah kuyup.)" },
      { choice: [
        { text: "\"Kok dicopot?\"", add: { courage: 1 }, goto: "d2_pagi_yuanyuan_tanya" },
        { text: "\"Aku suka foto yang itu.\"", add: { trust: 1 }, set: ["foto_dari_yuan"], goto: "d2_pagi_yuanyuan_foto" },
        { text: "(Diam memandangi papan.)", add: { courage: -1 }, goto: "d2_pagi_yuanyuan_diam" },
      ] },
    ],
  },
  d2_pagi_yuanyuan_tanya: {
    lines: [
      { who: "yuanyuan", text: "Biar papannya bisa dipakai adik kelas. Nanti... aku tempel lagi di tempat lain." },
      { who: "ranran", text: "(Di tempat lain. Di mana?)" },
    ],
  },
  d2_pagi_yuanyuan_foto: {
    lines: [
      { who: "yuanyuan", face: "senyum", text: "Yang ini? Ambil aja, Ran. Simpan, ya." },
      { who: "ranran", text: "(Kenapa rasanya kayak dikasih kenang-kenangan?)" },
    ],
  },
  d2_pagi_yuanyuan_diam: {
    lines: [{ text: "Papan itu kosong sekarang. Cuma bekas paku payung, kecil-kecil, seperti titik di akhir kalimat." }],
  },

  d2_pagi_bumei: {
    main: true,
    lines: [
      { who: "bumei", text: "Ranran, duduk sebentar. Ibu lihat kamu sering melamun ke kursi sebelah." },
      { choice: [
        { text: "\"Bu, kalau teman menyembunyikan sesuatu, kita harus gimana?\"", add: { courage: 1 }, set: ["mei_nasihat"], goto: "mei_nasihat_isi" },
        { text: "\"Saya baik-baik saja, Bu.\"", add: { courage: -1 }, goto: "mei_baik_saja" },
      ] },
    ],
  },
  // Dipakai bersama oleh d2_pagi_bumei dan d3_pagi_bumei_nasihat
  mei_nasihat_isi: {
    lines: [
      { who: "bumei", text: "Tanya dengan sabar. Dan pastikan dia tahu kamu tetap di sana, apa pun jawabannya." },
      { who: "bumei", text: "Kadang orang diam bukan karena tidak percaya, tapi karena takut merepotkan." },
    ],
  },
  mei_baik_saja: {
    lines: [
      { who: "bumei", text: "Kamu selalu bilang begitu, ya." },
      { who: "bumei", face: "senyum", text: "Ibu cuma mau kamu tahu, kamu boleh tidak baik-baik saja." },
    ],
  },

  d2_pagi_hao_slip: {
    when: { flags: ["hao_ragu"], min: { courage: 2 } },
    lines: [
      { who: "hao", text: "Ran, menurutmu Malang dingin nggak? ...Bukan apa-apa. Aku lagi nonton acara masak. Apel Malang." },
      { who: "ranran", text: "(Hao nggak pernah nonton acara masak. Dia bahkan nggak bisa masak mi.)" },
      { choice: [
        { text: "\"Hao. Malang?\"", reply: [{ who: "hao", text: "Apel! Apel Malang. Vitamin. Bagus buat otak. Sudah, ya." }] },
        { text: "(Diam saja, tapi ingat kata itu.)", reply: [{ who: "ranran", text: "(Malang.)" }] },
      ] },
    ],
  },
  d2_pagi_hao: {
    lines: [
      { who: "hao", face: "senyum", text: "Draf pesan kelas aman? Kalau buntu, mulai dari \"Dear kelas 12, kalian berisik.\" Dijamin jujur." },
      { choice: [
        { text: "\"Itu bukan pesan, itu keluhan.\"", reply: [{ who: "hao", text: "Keluhan yang tulus juga pesan, Ran." }] },
        { text: "\"Makasih idenya, Ketua.\"", reply: [{ who: "hao", text: "Sama-sama. Tagihannya dikirim lewat traktiran." }] },
      ] },
    ],
  },

  d2_pagi_yining_latihan: {
    when: { flags: ["yining_kenal"] },
    lines: [
      { who: "yining", text: "Kamu lagi. ...Aku latihan pidato. Ibuku datang Jumat. Dia minta tidak ada satu kata pun yang salah." },
      { who: "yining", text: "Jangan bilang siapa-siapa aku latihan di sini." },
      { choice: [
        { text: "\"Pidatomu pasti bagus.\"", reply: [{ who: "yining", text: "\"Pasti\" bukan kata yang dipakai ibuku." }] },
        { text: "\"Rahasia aman.\"", reply: [{ who: "yining", text: "...Terima kasih." }] },
      ] },
    ],
  },
  d2_pagi_yining: {
    lines: [
      { who: "yining", text: "Song Xinran, ini area panitia. Kecuali kamu mau bantu angkat kursi, silakan lewat." },
      { choice: [
        { text: "\"Boleh, aku bantu angkat.\"", reply: [{ who: "yining", text: "Kursi biru ke kiri, kursi merah ke kanan. Jangan dibalik." }] },
        { text: "\"Permisi, lewat.\"", reply: [{ who: "yining", text: "Silakan." }] },
      ] },
    ],
  },

  d2_istirahat_intro: {
    lines: [{ text: "Ranran menoleh ke kursi sebelah. Kosong lagi. Tasnya ada, orangnya tidak." }],
  },

  d2_istirahat_yining: {
    main: true,
    lines: [
      { who: "yining", text: "Song Xinran. Kamu teliti, kan? Periksa susunan acara ini. Tiga kali." },
      { text: "Di daftar dokumentasi acara, nama Fei Qinyuan dicoret dan diganti nama lain." },
      { choice: [
        { text: "\"Kok nama Yuanyuan dicoret?\"", add: { courage: 1 }, set: ["yining_kenal"], goto: "d2_istirahat_yining_coret" },
        { text: "\"Aku periksa. Tapi kamu juga istirahat, ya.\"", add: { trust: 1 }, set: ["yining_kenal"], goto: "d2_istirahat_yining_istirahat" },
      ] },
    ],
  },
  d2_istirahat_yining_coret: {
    lines: [
      { who: "yining", text: "Dia mundur. Minggu lalu." },
      { who: "yining", text: "Alasannya bukan urusanku untuk cerita. Tanya dia." },
    ],
  },
  d2_istirahat_yining_istirahat: {
    lines: [
      { who: "yining", text: "...Istirahat itu untuk orang yang sudah selesai." },
      { who: "yining", text: "Tapi, terima kasih." },
    ],
  },

  d2_istirahat_darto: {
    main: true,
    lines: [
      { who: "darto", text: "Neng cari Neng Fei? Dia di atas. Jangan bilang saya yang bilang." },
      { choice: [
        { text: "\"Pak, boleh saya ke atas juga?\"", when: { flags: ["darto_kenal"], min: { courage: 2 } }, add: { courage: 1 }, set: ["atap_terbuka"], goto: "darto_buka_atap" },
        { text: "\"Dia baik-baik saja, Pak?\"", add: { trust: 1 }, goto: "d2_istirahat_darto_baik" },
        { text: "\"Nggak apa-apa, Pak. Saya ke kelas aja.\"", add: { courage: -1 } },
      ] },
      { who: "darto", text: "Ya sudah, Neng." },
    ],
  },
  // Dipakai bersama oleh semua scene Pak Darto yang membuka atap
  darto_buka_atap: {
    lines: [
      { who: "darto", text: "Hmm. Neng ini sudah berani nanya, ya. Ya sudah." },
      { who: "darto", face: "senyum", text: "Mulai sekarang pintu atap saya buka buat Neng juga. Pelan-pelan naiknya. Tangganya curam, kayak hidup." },
    ],
  },
  d2_istirahat_darto_baik: {
    lines: [{ who: "darto", text: "Kelihatannya. Tapi orang yang kelihatan baik-baik saja itu yang paling perlu ditanya." }],
  },

  d2_istirahat_hao: {
    lines: [
      { who: "hao", text: "Yuanyuan? Tadi naik tangga ke atap. Padahal pintunya dikunci... Pak Darto pasti ikut kongkalikong." },
      { who: "hao", face: "senyum", text: "Aku nggak lihat apa-apa. Aku cuma ketua kelas yang kebetulan punya mata." },
      { choice: [
        { text: "\"Kamu sering lihat dia ke atas?\"", reply: [{ who: "hao", text: "Akhir-akhir ini tiap istirahat. Kayak orang yang lagi pamitan sama pemandangan." }] },
        { text: "\"Kongkalikong itu kata yang berat, Hao.\"", reply: [{ who: "hao", text: "Aku ketua kelas. Kosakataku harus berwibawa." }] },
      ] },
    ],
  },

  d2_pulang_yuanyuan: {
    main: true,
    lines: [
      { text: "Sebuah mobil menunggu di gerbang. Kursi belakangnya penuh kardus bertuliskan \"Dapur\" dan \"Buku\"." },
      { text: "Dari dalam mobil, ibu Yuanyuan memanggil, \"Qinyuan, kardusnya sudah semua?\"" },
      { who: "yuanyuan", face: "kaget", text: "S-sudah, Ma. Ran, ini... beres-beres gudang." },
      { choice: [
        { text: "\"Kalian mau pindahan?\"", add: { courage: 1 }, goto: "d2_pulang_yuanyuan_tanya" },
        { text: "\"Hati-hati, Yuan.\"", add: { trust: 1 }, goto: "d2_pulang_yuanyuan_hati" },
        { text: "(Pura-pura tidak melihat kardusnya.)", add: { courage: -1 }, goto: "d2_pulang_yuanyuan_diam" },
      ] },
    ],
  },
  d2_pulang_yuanyuan_tanya: {
    lines: [{ who: "yuanyuan", text: "Nggak... maksudku, belum tentu. Nanti aku cerita, ya. Janji." }],
  },
  d2_pulang_yuanyuan_hati: {
    lines: [{ who: "yuanyuan", face: "senyum", text: "Kamu juga, Ran. Makan yang bener." }],
  },
  d2_pulang_yuanyuan_diam: {
    lines: [{ who: "ranran", text: "(Gudang. Iya. Gudang.)" }],
  },

  d2_pulang_bumei: {
    lines: [
      { who: "bumei", text: "Ranran, belum pulang? Ibu juga belum. Berkas kelulusan ini tidak mau berkurang sendiri." },
      { who: "bumei", text: "Kalau minggu ini terasa berat, itu wajar. Perpisahan memang berat untuk semua orang. Termasuk guru." },
      { choice: [
        { text: "\"Saya bantu bawa, Bu?\"", reply: [{ who: "bumei", text: "Terima kasih, Ranran. Yang ringan saja. Yang berat biar Ibu yang pikul." }] },
        { text: "\"Ibu juga istirahat, ya.\"", reply: [{ who: "bumei", text: "Nanti, setelah kalian semua lulus. Itu istirahat terbaik seorang guru." }] },
      ] },
    ],
  },

  d2_malam: {
    lines: [
      { who: "ranran", text: "(Kardus. Foto yang dicopot. Nama yang dicoret.)" },
      { who: "ranran", when: { min: { courage: 2 } }, text: "(Aku nggak boleh pura-pura nggak lihat lagi. Besok aku harus nanya lebih banyak.)" },
      { who: "ranran", when: { max: { courage: 1 } }, text: "(Mungkin semua ini nggak ada hubungannya. Mungkin aku cuma overthinking. Kayak biasa.)" },
    ],
  },
};
