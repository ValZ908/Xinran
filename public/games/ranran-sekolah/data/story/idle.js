// Obrolan ringan saat NPC sudah tidak punya obrolan baru di slot ini. Bisa diulang, tanpa efek.
const idle = (who, text) => ({ repeat: true, lines: [{ who, text }] });

export default {
  yuanyuan_idle: idle("yuanyuan", "Ran? Kenapa? ...Nggak, nggak apa-apa. Aku cuma lagi mikir."),
  hao_idle: idle("hao", "Ketua kelas sedang sibuk berpikir. Silakan antre. Antreannya cuma kamu."),
  bumei_idle: idle("bumei", "Ibu masih di sini kalau kamu butuh, Ranran."),
  darto_idle: idle("darto", "Gerbang aman, Neng. Hati aman? Itu urusan masing-masing."),
  yining_idle: idle("yining", "Ada lagi? Aku sedang menghitung kursi."),
  atap_terkunci: { repeat: true, lines: [{ text: "Pintu tangga ke atap digembok. Katanya, kuncinya cuma dipegang Pak Darto." }] },
};
