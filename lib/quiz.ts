import type { Lang } from "@/lib/i18n";

// Semua jawaban diambil dari data yang sudah ada di website
// (Team History, Senbatsu, Best Partners, Catchphrase).

type L = Record<Lang, string>;

export type Question = {
  q: L;
  /** Pilihan jawaban; yang benar di indeks `answer`. Urutan diacak saat main. */
  options: (string | L)[];
  answer: number;
  fact: L;
};

export const QUESTIONS: Question[] = [
  {
    q: {
      en: "In which year did Ranran join SNH48?",
      id: "Tahun berapa Ranran bergabung dengan SNH48?",
      zh: "冉冉是哪一年加入SNH48的？",
    },
    options: ["2014", "2015", "2016", "2017"],
    answer: 1,
    fact: {
      en: "She joined as a Trainee on 31 January 2015.",
      id: "Ia bergabung sebagai Trainee pada 31 Januari 2015.",
      zh: "她于2015年1月31日以研究生身份加入。",
    },
  },
  {
    q: {
      en: "Which team was she first promoted to?",
      id: "Ke tim mana ia pertama kali dipromosikan?",
      zh: "她最初升格到了哪支队伍？",
    },
    options: ["Team SII", "Team NII", "Team X", "Team HII"],
    answer: 2,
    fact: {
      en: "She was promoted at the Team X Formation on 17 April 2015.",
      id: "Ia dipromosikan saat pembentukan Team X pada 17 April 2015.",
      zh: "她在2015年4月17日Team X组建时升格。",
    },
  },
  {
    q: {
      en: "How many days after joining was she promoted?",
      id: "Berapa hari setelah bergabung ia dipromosikan?",
      zh: "她加入后多少天就升格了？",
    },
    options: ["30", "76", "150", "365"],
    answer: 1,
    fact: {
      en: "Just 76 days, from Trainee to Team X.",
      id: "Hanya 76 hari, dari Trainee ke Team X.",
      zh: "仅仅76天，就从研究生升格为Team X成员。",
    },
  },
  {
    q: {
      en: "What is her best Senbatsu Election rank?",
      id: "Berapa peringkat terbaiknya di Pemilihan Senbatsu?",
      zh: "她在总选中的最高名次是？",
    },
    options: ["#1", "#2", "#3", "#5"],
    answer: 1,
    fact: {
      en: "#2 with the Silver Award at the 12th election (2025).",
      id: "#2 dengan Silver Award di pemilihan ke-12 (2025).",
      zh: "第12届总选（2025）第2名，获得银奖。",
    },
  },
  {
    q: {
      en: "At which election did she first reach the Top 3?",
      id: "Di pemilihan ke berapa ia pertama kali masuk Top 3?",
      zh: "她第一次进入前三名是在第几届总选？",
    },
    options: [
      { en: "6th", id: "ke-6", zh: "第6届" },
      { en: "7th", id: "ke-7", zh: "第7届" },
      { en: "10th", id: "ke-10", zh: "第10届" },
      { en: "12th", id: "ke-12", zh: "第12届" },
    ],
    answer: 1,
    fact: {
      en: "The 7th election in 2020, at #3.",
      id: "Pemilihan ke-7 tahun 2020, di peringkat #3.",
      zh: "2020年第7届总选，排名第3。",
    },
  },
  {
    q: {
      en: "What was her rank at the 10th election?",
      id: "Peringkat berapa yang ia raih di pemilihan ke-10?",
      zh: "她在第10届总选中排名第几？",
    },
    options: ["#2", "#3", "#5", "#11"],
    answer: 1,
    fact: {
      en: "#3, winning the Bronze Award in 2023.",
      id: "#3, meraih Bronze Award tahun 2023.",
      zh: "第3名，在2023年获得铜奖。",
    },
  },
  {
    q: {
      en: "Which election did she NOT take part in?",
      id: "Pemilihan mana yang TIDAK ia ikuti?",
      zh: "她没有参加哪一届总选？",
    },
    options: [
      { en: "2nd", id: "ke-2", zh: "第2届" },
      { en: "9th", id: "ke-9", zh: "第9届" },
      { en: "11th", id: "ke-11", zh: "第11届" },
      { en: "13th", id: "ke-13", zh: "第13届" },
    ],
    answer: 3,
    fact: {
      en: "She didn't participate in the 13th election.",
      id: "Ia tidak ikut di pemilihan ke-13.",
      zh: "她没有参加第13届总选。",
    },
  },
  {
    q: {
      en: "In her catchphrase, what is today's weather?",
      id: "Di catchphrase-nya, bagaimana cuaca hari ini?",
      zh: "在她的口号里，今天的天气是？",
    },
    options: [
      { en: "Rainy rainy", id: "Rainy rainy", zh: "下雨下雨" },
      { en: "Cloudy cloudy", id: "Cloudy cloudy", zh: "多云多云" },
      { en: "Sunny sunny", id: "Sunny sunny", zh: "Sunny sunny" },
      { en: "Snowy snowy", id: "Snowy snowy", zh: "下雪下雪" },
    ],
    answer: 2,
    fact: {
      en: "Sunny sunny, because the little sun 【冉冉升起】 rises!",
      id: "Sunny sunny, karena si matahari kecil 【冉冉升起】 terbit!",
      zh: "Sunny sunny，因为小太阳【冉冉升起】！",
    },
  },
  {
    q: {
      en: "Who was her partner in Best Partners 2.0?",
      id: "Siapa partner-nya di Best Partners 2.0?",
      zh: "最佳拍档2.0中她的拍档是谁？",
    },
    options: [
      "Fei QinYuan",
      "Yuan YiQi",
      { en: "She didn't take part", id: "Ia tidak ikut", zh: "她没有参加" },
    ],
    answer: 1,
    fact: {
      en: "Yuan YiQi, reaching Stage 2. In 3.0 she teamed up with Fei QinYuan.",
      id: "Yuan YiQi, sampai Stage 2. Di 3.0 ia berpasangan dengan Fei QinYuan.",
      zh: "袁一琦，晋级Stage 2。3.0时她与费沁源组队。",
    },
  },
  {
    q: {
      en: "Which team did she officially transfer to in 2026?",
      id: "Ke tim mana ia resmi pindah pada 2026?",
      zh: "2026年她正式移籍到了哪支队伍？",
    },
    options: ["Team SII", "Team NII", "Team X", "Team HII"],
    answer: 3,
    fact: {
      en: "Team HII, on 30 August 2026, after a year as a concurrent member.",
      id: "Team HII, pada 30 Agustus 2026, setelah setahun berposisi rangkap.",
      zh: "2026年8月30日正式移籍Team HII，此前已兼任一年。",
    },
  },
];

export const optionText = (o: string | L, lang: Lang) => (typeof o === "string" ? o : o[lang]);
