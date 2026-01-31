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
