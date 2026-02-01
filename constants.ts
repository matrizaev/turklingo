import { AnalysisOptions } from "./types";

export const DEFAULT_OPTIONS: AnalysisOptions = {
  beginnerFriendly: true,
  showVowelHarmony: true,
  showIPA: false,
  outputLanguage: 'English',
  detailLevel: 'Normal',
};

export const EXAMPLE_INPUTS = [
  "Evlerimizden",
  "Bugün okula gitmeyeceğim.",
  "Avrupalılaştıramadıklarımızdanmışsınızcasına",
  "Seni seviyorum.",
  "Gelebilirim",
  "Kitabı masaya bıraktı."
];

export const POS_COLORS: Record<string, string> = {
  NOUN: "bg-blue-100 text-blue-800 border-blue-200",
  VERB: "bg-green-100 text-green-800 border-green-200",
  ADJ: "bg-purple-100 text-purple-800 border-purple-200",
  ADV: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PRON: "bg-orange-100 text-orange-800 border-orange-200",
  DET: "bg-gray-100 text-gray-800 border-gray-200",
  ADP: "bg-indigo-100 text-indigo-800 border-indigo-200",
  CONJ: "bg-pink-100 text-pink-800 border-pink-200",
  PART: "bg-teal-100 text-teal-800 border-teal-200",
  INTJ: "bg-red-100 text-red-800 border-red-200",
  NUM: "bg-cyan-100 text-cyan-800 border-cyan-200",
  PUNCT: "bg-slate-100 text-slate-800 border-slate-200",
  X: "bg-gray-100 text-gray-600 border-gray-200",
};

export const UI_STRINGS = {
  en: {
    appTitle: "TurkLingo",
    tagline: "AI Grammar & Morphology Analyzer",
    about: "About",
    analyze: "Analyze",
    analyzing: "Analyzing...",
    clear: "Clear",
    options: "Options",
    hideOptions: "Hide Options",
    inputPlaceholder: "e.g., Evlerimizden...",
    inputLabel: "Enter Turkish word or sentence",
    // Tabs
    mainTabs: {
      analyzer: "Analyzer",
      reference: "Grammar Library"
    },
    // Options
    beginnerFriendly: "Beginner-friendly explanations",
    showVowelHarmony: "Show vowel harmony rules",
    showIPA: "Show IPA pronunciation",
    detailLevel: "Detail Level",
    outputLanguage: "Output Language",
    // Results
    detectedLanguage: "Detected Language",
    sentence: "Sentence",
    singleWord: "Single Word",
    unknown: "Unknown",
    meaning: "Meaning",
    keyNotes: "Key Grammatical Notes",
    commonMistakes: "Common Mistakes",
    morphologyChain: "Morphology Chain",
    inflection: "Inflection",
    derivation: "Derivation",
    root: "Root",
    harmonyRules: "Harmony Rules Applied",
    tabs: {
      overview: "Overview",
      tokens: "Tokens",
      suffix: "Suffixes",
      reference: "Reference"
    },
    ref: {
      nouns: "Noun Inflections",
      verbs: "Verb Conjugations",
      derivations: "Common Derivations",
      phonetics: "Phonetic Rules",
      vowelHarmony: "Vowel Harmony",
      consonantAlteration: "Consonant Softening (KETÇAP)",
      consonantAssimilation: "Consonant Assimilation (Fıstıkçı Şahap)",
      bufferLetters: "Buffer Letters (YaŞaSıN)",
      suffix: "Suffix",
      meaning: "Function / Meaning",
      example: "Example",
      trigger: "Last Vowel",
      result: "Suffix Vowel",
      change: "Change",
      cases: "Case",
      plural: "Plural",
      possessive: "Possession",
      tenses: "Tense/Aspect",
      person: "Person",
      derivation: "Derivation",
      letter: "Letter"
    },
    history: "Recent Analyses",
    copyJson: "JSON",
    tryAgain: "Try Again",
    analysisFailed: "Analysis Failed",
    footer: "© {year} TurkLingo Analyzer. Built with React, Tailwind & Gemini.",
    aboutMessage: "TurkLingo v1.0\nPowered by Google Gemini"
  },
  ru: {
    appTitle: "TurkLingo",
    tagline: "ИИ Анализатор грамматики",
    about: "О приложении",
    analyze: "Анализ",
    analyzing: "Думаю...",
    clear: "Очистить",
    options: "Настройки",
    hideOptions: "Скрыть настройки",
    inputPlaceholder: "например, Evlerimizden...",
    inputLabel: "Введите турецкое слово или фразу",
    // Tabs
    mainTabs: {
      analyzer: "Анализатор",
      reference: "Справочник"
    },
    // Options
    beginnerFriendly: "Простые объяснения (для новичков)",
    showVowelHarmony: "Правила гармонии гласных",
    showIPA: "Показывать транскрипцию (IPA)",
    detailLevel: "Детализация",
    outputLanguage: "Язык ответа",
    // Results
    detectedLanguage: "Определенный язык",
    sentence: "Предложение",
    singleWord: "Слово",
    unknown: "Неизвестно",
    meaning: "Значение",
    keyNotes: "Грамматические заметки",
    commonMistakes: "Частые ошибки",
    morphologyChain: "Морфологическая цепочка",
    inflection: "Словоизменение",
    derivation: "Словообразование",
    root: "Корень",
    harmonyRules: "Гармония гласных",
    tabs: {
      overview: "Обзор",
      tokens: "Токены",
      suffix: "Суффиксы",
      reference: "Справочник"
    },
    ref: {
      nouns: "Изменение существительных",
      verbs: "Спряжение глаголов",
      derivations: "Словообразование",
      phonetics: "Фонетические правила",
      vowelHarmony: "Гармония гласных",
      consonantAlteration: "Смягчение согласных (KETÇAP)",
      consonantAssimilation: "Уподобление согласных (Fıstıkçı Şahap)",
      bufferLetters: "Промежуточные буквы (YaŞaSıN)",
      suffix: "Суффикс",
      meaning: "Функция / Значение",
      example: "Пример",
      trigger: "Последняя гласная",
      result: "Гласная суффикса",
      change: "Замена",
      cases: "Падеж",
      plural: "Мн. число",
      possessive: "Принадлежность",
      tenses: "Время/Аспект",
      person: "Лицо",
      derivation: "Образование",
      letter: "Буква"
    },
    history: "История",
    copyJson: "JSON",
    tryAgain: "Повторить",
    analysisFailed: "Ошибка анализа",
    footer: "© {year} TurkLingo Analyzer. Создано на React, Tailwind и Gemini.",
    aboutMessage: "TurkLingo v1.0\nРаботает на Google Gemini"
  }
};

export const PHONETIC_RULES = {
  en: {
    vowelTwoWay: [
      { trigger: "a, ı, o, u", result: "a", examples: "-lar, -da, -dan, -a" },
      { trigger: "e, i, ö, ü", result: "e", examples: "-ler, -de, -den, -e" },
    ],
    vowelFourWay: [
      { trigger: "a, ı", result: "ı", examples: "-ın, -lı, -dı, -cı" },
      { trigger: "e, i", result: "i", examples: "-in, -li, -di, -ci" },
      { trigger: "o, u", result: "u", examples: "-un, -lu, -du, -cu" },
      { trigger: "ö, ü", result: "ü", examples: "-ün, -lü, -dü, -cü" },
    ],
    consonantsSoftening: [
      { change: "k → ğ / g", context: "Becomes ğ (or g) before a vowel", example: "Köpek + i = Köpeği" },
      { change: "t → d", context: "Becomes d before a vowel", example: "Git + iyor = Gidiyor" },
      { change: "ç → c", context: "Becomes c before a vowel", example: "Ağaç + a = Ağaca" },
      { change: "p → b", context: "Becomes b before a vowel", example: "Kitap + ı = Kitabı" },
    ],
    consonantsAssimilation: [
      { change: "c → ç", context: "After voiceless (f, s, t, k, ç, ş, h, p)", example: "Aş + cı = Aşçı" },
      { change: "d → t", context: "After voiceless (f, s, t, k, ç, ş, h, p)", example: "Kitap + da = Kitapta" },
      { change: "g → k", context: "After voiceless (f, s, t, k, ç, ş, h, p)", example: "Sert + ce = Sertçe" },
    ],
    bufferLetters: [
      { letter: "y", context: "General buffer between two vowels", example: "Kedi + e = Kediye" },
      { letter: "ş", context: "Distributive numbers only", example: "İki + er = İkişer" },
      { letter: "s", context: "3rd person possessive suffix", example: "Kedi + i = Kedisi" },
      { letter: "n", context: "Genitive case, or between possessive and cases", example: "Kedi + in = Kedinin, Arabası + nı = Arabasını" },
    ]
  },
  ru: {
    vowelTwoWay: [
      { trigger: "a, ı, o, u", result: "a", examples: "-lar, -da, -dan, -a" },
      { trigger: "e, i, ö, ü", result: "e", examples: "-ler, -de, -den, -e" },
    ],
    vowelFourWay: [
      { trigger: "a, ı", result: "ı", examples: "-ın, -lı, -dı, -cı" },
      { trigger: "e, i", result: "i", examples: "-in, -li, -di, -ci" },
      { trigger: "o, u", result: "u", examples: "-un, -lu, -du, -cu" },
      { trigger: "ö, ü", result: "ü", examples: "-ün, -lü, -dü, -cü" },
    ],
    consonantsSoftening: [
      { change: "k → ğ / g", context: "Переходит в ğ (или g) перед гласной", example: "Köpek + i = Köpeği" },
      { change: "t → d", context: "Переходит в d перед гласной", example: "Git + iyor = Gidiyor" },
      { change: "ç → c", context: "Переходит в c перед гласной", example: "Ağaç + a = Ağaca" },
      { change: "p → b", context: "Переходит в b перед гласной", example: "Kitap + ı = Kitabı" },
    ],
    consonantsAssimilation: [
      { change: "c → ç", context: "После глухих (f, s, t, k, ç, ş, h, p)", example: "Aş + cı = Aşçı" },
      { change: "d → t", context: "После глухих (f, s, t, k, ç, ş, h, p)", example: "Kitap + da = Kitapta" },
      { change: "g → k", context: "После глухих (f, s, t, k, ç, ş, h, p)", example: "Sert + ce = Sertçe" },
    ],
    bufferLetters: [
      { letter: "y", context: "Общий разделитель между двумя гласными", example: "Kedi + e = Kediye" },
      { letter: "ş", context: "Только в разделительных числительных", example: "İki + er = İkişer" },
      { letter: "s", context: "В суффиксе принадлежности 3-го лица", example: "Kedi + i = Kedisi" },
      { letter: "n", context: "Родительный падеж или между притяжательностью и падежом", example: "Kedi + in = Kedinin, Arabası + nı = Arabasını" },
    ]
  }
};

export const SUFFIX_DATA = {
  en: {
    nouns: [
      { cat: "plural", s: "-lar / -ler", m: "Plural", e: "Evler (Houses)" },
      { cat: "cases", s: "-(y)i / -ı / -u / -ü", m: "Accusative (Specific Direct Object)", e: "Evi gördüm (I saw the house)" },
      { cat: "cases", s: "-(y)e / -a", m: "Dative (Directional: To / Towards)", e: "Eve gidiyorum (I'm going home)" },
      { cat: "cases", s: "-de / -da / -te / -ta", m: "Locative (Position: At / In / On)", e: "Evde (At home)" },
      { cat: "cases", s: "-den / -dan / -ten / -tan", m: "Ablative (Origin: From / Than)", e: "Evden (From house)" },
      { cat: "cases", s: "-(n)in / -ın / -un / -ün", m: "Genitive (Possessor: 's / Of)", e: "Evin kapısı (The door of the house)" },
      { cat: "possessive", s: "-(i)m / -ım", m: "My (1st Person Sing.)", e: "Evim (My house)" },
      { cat: "possessive", s: "-(i)n / -ın", m: "Your (2nd Person Sing.)", e: "Evin (Your house)" },
      { cat: "possessive", s: "-(s)i / -ı", m: "His/Her/Its (3rd Person Sing.)", e: "Evi (His/Her house)" },
    ],
    verbs: [
      { cat: "tenses", s: "-ıyor / -iyor / -uyor / -üyor", m: "Present Continuous (-ing)", e: "Geliyorum (I am coming), Bakıyor (Looking)" },
      { cat: "tenses", s: "-di / -dı / -du / -dü", m: "Past (Seen/Witnessed)", e: "Geldi (He/She came)" },
      { cat: "tenses", s: "-miş / -mış / -muş / -müş", m: "Past (Reported/Heard)", e: "Gelmiş (He reportedly came)" },
      { cat: "tenses", s: "-ecek / -acak", m: "Future (Will)", e: "Gelecek (He/She will come)" },
      { cat: "tenses", s: "-r / -er / -ar", m: "Aorist (General / Often / Polite)", e: "Gelir (He/She usually comes)" },
      { cat: "person", s: "-im / -ım", m: "Personal marker: I", e: "Yazıyorum (I am writing)" },
      { cat: "person", s: "-sin / -sın", m: "Personal marker: You", e: "Yazıyorsun (You are writing)" },
      { cat: "person", s: "ø", m: "Personal marker: He/She/It", e: "Yazıyor (He is writing)" },
    ],
    derivations: [
      { cat: "derivation", s: "-ci / -cı / -cü / -cu", m: "Occupation / Habitual doer", e: "Sütçü (Milkman)" },
      { cat: "derivation", s: "-lik / -lık / -lük / -luk", m: "Abstraction / Destination", e: "Güzellik (Beauty), Kitaplık (Library)" },
      { cat: "derivation", s: "-li / -lı / -lü / -lu", m: "With / Possessing property", e: "Şekerli (With sugar)" },
      { cat: "derivation", s: "-siz / -sız / -süz / -suz", m: "Without / Lacking", e: "Şekersiz (Without sugar)" },
    ]
  },
  ru: {
    nouns: [
      { cat: "plural", s: "-lar / -ler", m: "Множественное число", e: "Evler (Дома)" },
      { cat: "cases", s: "-(y)i / -ı / -u / -ü", m: "Винительный падеж (Опред. объект)", e: "Evi gördüm (Я видел дом)" },
      { cat: "cases", s: "-(y)e / -a", m: "Дательный падеж (Направление)", e: "Eve gidiyorum (Я иду домой)" },
      { cat: "cases", s: "-de / -da / -te / -ta", m: "Местный падеж (Местоположение)", e: "Evde (Дома)" },
      { cat: "cases", s: "-den / -dan / -ten / -tan", m: "Исходный падеж (Откуда / Чем)", e: "Evden (Из дома)" },
      { cat: "cases", s: "-(n)in / -ın / -un / -ün", m: "Родительный падеж (Обладание)", e: "Evin kapısı (Дверь дома)" },
      { cat: "possessive", s: "-(i)m / -ım", m: "Мой (1-е л. ед.ч.)", e: "Evim (Мой дом)" },
      { cat: "possessive", s: "-(i)n / -ın", m: "Твой (2-е л. ед.ч.)", e: "Evin (Твой дом)" },
      { cat: "possessive", s: "-(s)i / -ı", m: "Его/Её (3-е л. ед.ч.)", e: "Evi (Его дом)" },
    ],
    verbs: [
      { cat: "tenses", s: "-ıyor / -iyor / -uyor / -üyor", m: "Настоящее продолженное", e: "Geliyorum (Я иду), Bakıyor (Смотрит)" },
      { cat: "tenses", s: "-di / -dı / -du / -dü", m: "Прошедшее категорическое (увиденное)", e: "Geldi (Он пришел)" },
      { cat: "tenses", s: "-miş / -мыш / -муш / -мюш", m: "Прошедшее субъективное (услышанное)", e: "Gelmiş (Говорят, он пришел)" },
      { cat: "tenses", s: "-ecek / -acak", m: "Будущее", e: "Gelecek (Он придет)" },
      { cat: "tenses", s: "-r / -er / -ar", m: "Aorist (Привычное / Вежливое)", e: "Gelir (Он обычно приходит)" },
      { cat: "person", s: "-im / -ım", m: "Личное окончание: Я", e: "Yazıyorum (Я пишу)" },
      { cat: "person", s: "-sin / -sın", m: "Личное окончание: Ты", e: "Yazıyorsun (Ты пишешь)" },
      { cat: "person", s: "ø", m: "Личное окончание: Он/Она", e: "Yazıyor (Он пишет)" },
    ],
    derivations: [
      { cat: "derivation", s: "-ci / -cı / -cü / -cu", m: "Профессия / Деятель", e: "Sütçü (Молочник)" },
      { cat: "derivation", s: "-lik / -lık / -lük / -luk", m: "Абстракция / Место хранения", e: "Güzellik (Красота), Kitaplık (Книжный шкаф)" },
      { cat: "derivation", s: "-li / -lı / -lü / -lu", m: "С чем-то / Обладание свойством", e: "Şekerli (С сахаром)" },
      { cat: "derivation", s: "-siz / -sız / -süz / -suz", m: "Без чего-то / Отсутствие", e: "Şekersiz (Без сахара)" },
    ]
  }
};