export type MockVocabWord = {
  id: number;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  illustration: string;
};

export const mockCourse = {
  title: "TỪ VỰNG TOEIC CƠ BẢN",
  teacher: "Mr. Hiep TOEIC",
};

export const mockWords: MockVocabWord[] = [
  {
    id: 1,
    word: "commence",
    phonetic: "/kəˈmens/",
    partOfSpeech: "v",
    meaning: "khởi đầu",
    illustration: "🚦",
  },
  {
    id: 2,
    word: "accomplish",
    phonetic: "/əˈkʌmplɪʃ/",
    partOfSpeech: "v",
    meaning: "hoàn thành",
    illustration: "🏆",
  },
  {
    id: 3,
    word: "negotiate",
    phonetic: "/nɪˈɡəʊʃieɪt/",
    partOfSpeech: "v",
    meaning: "đàm phán",
    illustration: "🤝",
  },
  {
    id: 4,
    word: "reimburse",
    phonetic: "/ˌriːɪmˈbɜːs/",
    partOfSpeech: "v",
    meaning: "hoàn trả",
    illustration: "💵",
  },
  {
    id: 5,
    word: "inventory",
    phonetic: "/ˈɪnvəntri/",
    partOfSpeech: "n",
    meaning: "hàng tồn kho",
    illustration: "📦",
  },
  {
    id: 6,
    word: "candidate",
    phonetic: "/ˈkændɪdət/",
    partOfSpeech: "n",
    meaning: "ứng viên",
    illustration: "🧑‍💼",
  },
  {
    id: 7,
    word: "postpone",
    phonetic: "/pəˈspəʊn/",
    partOfSpeech: "v",
    meaning: "hoãn lại",
    illustration: "🗓️",
  },
  {
    id: 8,
    word: "reliable",
    phonetic: "/rɪˈlaɪəbl/",
    partOfSpeech: "adj",
    meaning: "đáng tin cậy",
    illustration: "🛡️",
  },
  {
    id: 9,
    word: "supervise",
    phonetic: "/ˈsuːpəvaɪz/",
    partOfSpeech: "v",
    meaning: "giám sát",
    illustration: "🔍",
  },
  {
    id: 10,
    word: "voucher",
    phonetic: "/ˈvaʊtʃər/",
    partOfSpeech: "n",
    meaning: "phiếu giảm giá",
    illustration: "🎟️",
  },
];

// Course-level scoring config — mirrors Course.wordsPerSession / pointsPerCorrect / pointsPerWrong on the backend.
export const scoringConfig = {
  wordsPerSession: mockWords.length,
  pointsPerCorrect: 10,
  pointsPerWrong: -2,
};
