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
      tokens: "Token Analysis",
      suffix: "Suffix Breakdown",
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
      tokens: "По токенам",
      suffix: "Суффиксы",
    },
    history: "История",
    copyJson: "JSON",
    tryAgain: "Повторить",
    analysisFailed: "Ошибка анализа",
    footer: "© {year} TurkLingo Analyzer. Создано на React, Tailwind и Gemini.",
    aboutMessage: "TurkLingo v1.0\nРаботает на Google Gemini"
  }
};