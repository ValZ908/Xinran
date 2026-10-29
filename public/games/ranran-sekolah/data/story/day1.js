// HARI 1 — Senin. Empat hari menjelang perpisahan.
//
// Format satu scene:
//   id: { main?: true, repeat?: true, when?: {...}, lines: [ ...baris ] }
//   main:   obrolan utama, slot waktu berakhir setelah scene ini (lihat data/schedule.js)
//   repeat: boleh diputar berulang (biasanya hanya obrolan ringan *_idle)
// Jenis baris:
//   { who: "hao", face: "senyum", text: "..." }   bicara (who kosong = narasi)
//   { choice: [ { text, add, set, goto, when, reply }, ... ] }   2–3 opsi yang tampil
//      reply: [ ...baris ] balasan khusus opsi itu, lalu lanjut ke baris sesudah pilihan
//   { add: { trust: 1 }, set: ["flag"] }          efek tanpa teks
//   { goto: "scene_lain" }                        lompat ke scene lain
// Baris dan opsi boleh punya `when` (syarat), formatnya ada di src/engine/state.js.

export default {
  d1_pagi_darto: {
    lines: [
      { who: "darto", face: "senyum", text: "Neng Ranran! Pagi! Jumat nanti perpisahan, ya. Lima hari lagi. Eh, empat. Saya ngitungnya pakai jari, Neng." },
      { who: "darto", text: "Lapangan bakal dipasangi panggung. Atap? Atap mah tetap dikunci. Dari zaman saya masih muda dan ganteng." },
      { who: "ranran", text: "(Pak Darto pernah ganteng?)" },
      { choice: [
        { text: "\"Pak Darto masih ganteng kok.\"", reply: [{ who: "darto", text: "Nah! Neng ini jujur. Nilai Bahasa Indonesianya pasti bagus." }] },
        { text: "\"Semangat jaganya, Pak.\"", reply: [{ who: "darto", text: "Siap, Neng. Gerbang ini nggak akan kabur." }] },
      ] },
    ],
  },

  d1_pagi_yining: {
    lines: [
      { who: "yining", text: "Song Xinran. Formulir kesan-pesan untuk buku perpisahan belum kamu kumpulkan." },
      { choice: [
        { text: "\"Maaf, besok kukumpulkan.\"" },
        { text: "\"Kamu sendiri sudah nulis?\"", add: { courage: 1 }, goto: "d1_pagi_yining_balik" },
      ] },
      { who: "yining", text: "Besok. Jangan telat. Aku sudah hafal semua alasan terlambat." },
    ],
  },
  d1_pagi_yining_balik: {
    lines: [
      { who: "yining", text: "...Sudah. Tiga kali kutulis ulang." },
      { who: "ranran", text: "(Dia kelihatan kaget ditanya balik.)" },
    ],
  },

  d1_pagi_bumei: {
    lines: [
      { who: "bumei", face: "senyum", text: "Ranran, sudah sarapan? ...Syukurlah. Ibu belum. Jangan ditiru." },
      { who: "bumei", text: "Minggu ini jangan terlalu dipikirkan sendirian, ya. Minggu perpisahan itu suka bikin orang aneh." },
      { who: "ranran", text: "(Kenapa Ibu bilang begitu ke aku?)" },
      { choice: [
        { text: "\"Ibu sarapan dulu, dong.\"", reply: [{ who: "bumei", text: "Iya, iya. Nanti Ibu beli gorengan Pak Darto. Kalau masih ada." }] },
        { text: "\"Aneh gimana, Bu?\"", reply: [{ who: "bumei", text: "Yang biasanya cerewet jadi diam. Yang biasanya diam jadi... makin diam." }] },
      ] },
    ],
  },

  d1_pagi_hao: {
    lines: [
      { who: "hao", face: "senyum", text: "Pagi, Song Xinran! Wajahmu hari ini mode \"overthinking level 3\"." },
      { choice: [
        { text: "\"Kamu tahu sesuatu soal Yuanyuan?\"", when: { min: { courage: 1 } }, add: { courage: 1 }, set: ["hao_ragu"], goto: "d1_pagi_hao_tanya" },
        { text: "\"Level 3? Biasanya level 5.\"", add: { trust: 1 }, goto: "d1_pagi_hao_canda" },
        { text: "(Senyum tipis saja.)" },
      ] },
    ],
  },
  d1_pagi_hao_tanya: {
    lines: [
      { who: "hao", face: "senyum", text: "Aku tahu banyak hal. Contoh: menu kantin hari ini tempe. Lagi." },
      { who: "hao", face: "serius", text: "...Tanya langsung ke dia, Ran. Jangan ke aku. Aku sudah... ah, lupakan." },
    ],
  },
  d1_pagi_hao_canda: {
    lines: [{ who: "hao", face: "senyum", text: "Hahaha! Nah, itu baru Ranran yang kukenal." }],
  },

  d1_pagi_yuanyuan: {
    main: true,
    lines: [
      { text: "Yuanyuan sedang membereskan kameranya. Dia tidak menoleh waktu Ranran masuk." },
      { who: "yuanyuan", face: "datar", text: "Oh... pagi, Ran." },
      { who: "ranran", text: "(Biasanya dia yang nyapa duluan. Sambil lari kecil, malah.)" },
      { choice: [
        { text: "\"Kamu kenapa sih akhir-akhir ini?\"", add: { courage: 1 }, goto: "d1_pagi_yuanyuan_tanya" },
        { text: "\"Nanti istirahat ke kantin bareng, yuk?\"", add: { trust: 1 }, goto: "d1_pagi_yuanyuan_ajak" },
        { text: "(Senyum saja, lalu duduk.)", add: { courage: -1 }, goto: "d1_pagi_yuanyuan_diam" },
      ] },
    ],
  },
  d1_pagi_yuanyuan_tanya: {
    lines: [
      { who: "yuanyuan", face: "kaget", text: "Kenapa apanya? Aku biasa aja kok." },
      { who: "yuanyuan", text: "...Aku ke ruang klub dulu, ya." },
    ],
  },
  d1_pagi_yuanyuan_ajak: {
    lines: [
      { who: "yuanyuan", face: "senyum", text: "Kantin, ya... Nanti aku kabari." },
      { who: "ranran", text: "(Itu bukan \"iya\".)" },
    ],
  },
  d1_pagi_yuanyuan_diam: {
    lines: [
      { who: "ranran", text: "(Nggak apa-apa. Mungkin dia cuma capek.)" },
      { who: "ranran", face: "sedih", text: "(...Aku selalu bilang begitu.)" },
    ],
  },

  d1_istirahat_intro: {
    lines: [{ text: "Bel istirahat berbunyi. Kursi di sebelah Ranran langsung kosong." }],
  },

  d1_istirahat_yuanyuan: {
    main: true,
    lines: [
      { text: "Yuanyuan berdiri di depan rak fotografi, mengembalikan setumpuk buku klub." },
      { who: "yuanyuan", text: "Eh, Ran. Ini... buku-buku klub. Udah nggak kepakai." },
      { who: "ranran", text: "(Itu buku yang dia pinjam terus sejak kelas 10. Dia bahkan kasih nama bukunya.)" },
      { choice: [
        { text: "\"Kamu keluar dari klub?\"", add: { courage: 1 }, goto: "d1_istirahat_yuanyuan_tanya" },
        { text: "\"Sini, aku bantu bawa.\"", add: { trust: 1 }, goto: "d1_istirahat_yuanyuan_bantu" },
        { text: "(Pura-pura nggak lihat.)", add: { courage: -1 }, goto: "d1_istirahat_yuanyuan_diam" },
      ] },
    ],
  },
  d1_istirahat_yuanyuan_tanya: {
    lines: [
      { who: "yuanyuan", text: "Cuma... istirahat dulu. Kelas 12 kan sibuk." },
      { who: "ranran", text: "(Kamu ketua dokumentasi perpisahan, Yuan. Kamu yang paling semangat soal acara itu.)" },
    ],
  },
  d1_istirahat_yuanyuan_bantu: {
    lines: [
      { text: "Mereka membawa buku bersama. Tangan Yuanyuan sempat berhenti di satu buku, lalu menaruhnya juga." },
      { who: "yuanyuan", face: "senyum", text: "Makasih, Ran. Kamu selalu gitu, ya. Nggak banyak nanya." },
    ],
  },
  d1_istirahat_yuanyuan_diam: {
    lines: [
      { who: "ranran", text: "(Bukan urusanku. Kalau dia mau cerita, dia pasti cerita.)" },
      { who: "ranran", text: "(...Kan?)" },
    ],
  },

  d1_istirahat_hao: {
    main: true,
    lines: [
      { who: "hao", face: "senyum", text: "Song Xinran! Tepat waktu. Panitia minta satu orang nulis pesan kelas buat dibacakan Jumat." },
      { who: "hao", text: "Dan aku, sebagai ketua kelas yang bijaksana, menunjuk... kamu." },
      { who: "ranran", text: "Kenapa aku?" },
      { who: "hao", text: "Karena kamu paling sering mikir, tapi paling jarang ngomong. Sayang kalau semua itu cuma jadi isi kepala." },
      { choice: [
        { text: "\"Oke. Aku coba.\"", add: { courage: 1 }, set: ["pesan_kelas"] },
        { text: "\"Cari orang lain aja, Hao.\"", add: { courage: -1 } },
      ] },
      { who: "hao", when: { flags: ["pesan_kelas"] }, face: "senyum", text: "Nah! Nanti kita latihan bacanya bareng. Aku bagian tepuk tangan." },
      { who: "hao", when: { notFlags: ["pesan_kelas"] }, text: "Yah. Ya udah, aku yang nulis. Siap-siap isinya lelucon semua." },
    ],
  },

  d1_istirahat_yining: {
    lines: [
      { who: "yining", text: "Song Xinran. Jangan injak garis itu. Itu posisi kursi tamu." },
      { choice: [
        { text: "\"Kamu nggak capek ngurus semuanya sendiri?\"", when: { min: { courage: 1 } }, set: ["yining_kenal"] },
        { text: "\"Panggungnya bakal bagus.\"" },
        { text: "(Mundur pelan-pelan.)" },
      ] },
      { who: "yining", when: { flags: ["yining_kenal"] }, text: "...Capek itu bukan alasan buat berhenti." },
      { who: "yining", when: { flags: ["yining_kenal"] }, text: "Tapi terima kasih sudah nanya. Jarang ada yang nanya." },
      { who: "yining", when: { notFlags: ["yining_kenal"] }, text: "Bagus kalau semua orang ikut aturan." },
    ],
  },

  d1_istirahat_bumei: {
    lines: [
      { who: "bumei", text: "Ranran, formulir kesan-pesanmu sudah? Belum? Tidak apa-apa, masih ada waktu." },
      { who: "bumei", text: "Yuanyuan malah mengumpulkan paling awal. Rapi sekali, sampai alamat barunya... eh." },
      { who: "bumei", text: "Maksud Ibu, alamatnya. Tulisannya rapi. Ibu lapar, jadi bicaranya ngawur." },
      { who: "ranran", text: "(Alamat... baru?)" },
      { choice: [
        { text: "\"Alamat baru apa, Bu?\"", reply: [{ who: "bumei", text: "Bukan apa-apa. Ibu salah baca. Kacamata Ibu ketinggalan di rumah... mungkin." }] },
        { text: "(Pura-pura tidak dengar.)", reply: [{ who: "ranran", text: "(Mungkin aku salah dengar. Mungkin.)" }] },
      ] },
    ],
  },

  d1_pulang_yuanyuan: {
    main: true,
    lines: [
      { text: "Di gerbang, Yuanyuan berdiri dengan tas di kedua bahu. Biasanya mereka jalan kaki bareng sampai perempatan." },
      { who: "yuanyuan", text: "Ran, aku dijemput hari ini. Duluan, ya." },
      { choice: [
        { text: "\"Besok pulang bareng, ya?\"", add: { trust: 1 }, goto: "d1_pulang_yuanyuan_besok" },
        { text: "\"Kamu marah sama aku?\"", add: { courage: 1 }, goto: "d1_pulang_yuanyuan_marah" },
        { text: "(Melambai saja.)", add: { courage: -1 }, goto: "d1_pulang_yuanyuan_lambai" },
      ] },
    ],
  },
  d1_pulang_yuanyuan_besok: {
    lines: [{ who: "yuanyuan", face: "senyum", text: "Besok... iya. Semoga." }],
  },
  d1_pulang_yuanyuan_marah: {
    lines: [
      { who: "yuanyuan", face: "kaget", text: "Hah? Nggak, Ran. Sumpah nggak." },
      { who: "yuanyuan", text: "Kamu nggak salah apa-apa. Beneran." },
    ],
  },
  d1_pulang_yuanyuan_lambai: {
    lines: [{ who: "ranran", text: "(Dia juga melambai. Senyumnya kelihatan capek.)" }],
  },

  d1_pulang_darto: {
    lines: [
      { who: "darto", face: "senyum", text: "Neng nunggu jemputan? Atau nunggu ilham?" },
      { choice: [
        { text: "\"Pak, atap itu kenapa dikunci?\"", add: { courage: 1 }, set: ["darto_kenal"], goto: "darto_tanya_atap" },
        { text: "\"Pulang dulu, Pak.\"" },
      ] },
      { who: "darto", text: "Hati-hati, Neng. Lihat kanan, kiri. Kanan lagi." },
    ],
  },
  // Dipakai bersama oleh d1_pulang_darto dan d2_pagi_darto
  darto_tanya_atap: {
    lines: [
      { who: "darto", text: "Wah, pertanyaan bagus. Jawabannya panjang. Ada hubungannya sama murid zaman dulu." },
      { who: "darto", face: "senyum", text: "Kapan-kapan saya cerita. Sekarang saya harus ngejar kucing yang nyuri gorengan saya." },
    ],
  },

  d1_pulang_hao: {
    lines: [
      { who: "hao", text: "Ran, tadi aku lihat Yuanyuan ke ruang TU sama ibunya. Ngurus apa ya? Beasiswa? Daftar klub lawak?" },
      { who: "hao", face: "serius", text: "...Lupakan. Aku kebanyakan ngomong. Ketua kelas juga manusia." },
      { choice: [
        { text: "\"Hao, kamu tahu sesuatu, ya?\"", reply: [{ who: "hao", text: "Aku? Aku tahu cara bikin pesawat kertas yang terbang tiga meter. Itu saja." }] },
        { text: "\"Klub lawak? Kamu dong ketuanya.\"", reply: [{ who: "hao", text: "Jelas. Anggotanya aku sendiri. Rapatnya seru banget." }] },
      ] },
    ],
  },

  d1_malam: {
    lines: [
      { text: "Malam. Kamar Ranran sunyi." },
      { who: "ranran", when: { min: { courage: 1 } }, text: "(Hari ini aku nanya sedikit. Cuma sedikit. Tapi rasanya kayak lari keliling lapangan.)" },
      { who: "ranran", when: { max: { courage: 0 } }, text: "(Aku bilang \"nggak apa-apa\" lagi hari ini. Ke diriku sendiri.)" },
      { who: "ranran", text: "(Empat hari lagi perpisahan. Kenapa rasanya aku yang ditinggal duluan?)" },
    ],
  },
};
