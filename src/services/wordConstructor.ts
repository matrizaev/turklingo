import { ConstructorSuffix } from "../types";

const VOWELS = ["a", "e", "ı", "i", "o", "ö", "u", "ü"];
const VOICELESS = ["f", "s", "t", "k", "ç", "ş", "h", "p"];
const SOFTENING_MAP: Record<string, string> = {
  p: "b",
  ç: "c",
  t: "d",
  k: "ğ",
};

const getLastVowel = (word: string) => {
  for (let i = word.length - 1; i >= 0; i -= 1) {
    if (VOWELS.includes(word[i])) return word[i];
  }
  return "";
};

const isVowel = (char: string) => VOWELS.includes(char);

const resolvePattern = (
  pattern: string,
  lastVowel: string,
  baseLast: string,
) => {
  if (!pattern) return "";
  const twoWay = ["a", "ı", "o", "u"].includes(lastVowel) ? "a" : "e";
  const fourWay = ["a", "ı"].includes(lastVowel)
    ? "ı"
    : ["e", "i"].includes(lastVowel)
      ? "i"
      : ["o", "u"].includes(lastVowel)
        ? "u"
        : "ü";
  const useVoiceless = VOICELESS.includes(baseLast);
  return pattern
    .replaceAll("A", twoWay)
    .replaceAll("I", fourWay)
    .replaceAll("D", useVoiceless ? "t" : "d")
    .replaceAll("C", useVoiceless ? "ç" : "c");
};

export type ConstructedWord = {
  surface: string;
  chain: string;
};

export const buildConstructedWord = (
  root: string,
  suffixes: ConstructorSuffix[],
): ConstructedWord => {
  if (!root) {
    return {
      surface: "",
      chain: "",
    };
  }

  let current = root;
  const chainParts = [root];

  suffixes.forEach((suffix) => {
    if (!suffix.pattern) return;

    const lastVowel = getLastVowel(current);
    let baseLast = current.slice(-1);
    let surface = resolvePattern(suffix.pattern, lastVowel, baseLast);
    let startsWithVowel = surface.length > 0 && isVowel(surface[0]);
    let endsWithVowel = current.length > 0 && isVowel(baseLast);
    let droppedVowel = false;

    if (suffix.contract === "dropLastVowel" && endsWithVowel) {
      current = current.slice(0, -1);
      baseLast = current.slice(-1);
      endsWithVowel = current.length > 0 && isVowel(baseLast);
      droppedVowel = true;
    }

    if (
      suffix.contract === "dropSuffixVowel" &&
      endsWithVowel &&
      startsWithVowel
    ) {
      surface = surface.slice(1);
      startsWithVowel = surface.length > 0 && isVowel(surface[0]);
    }

    if (endsWithVowel && startsWithVowel) {
      const buffer = suffix.buffer ?? "y";
      surface = `${buffer}${surface}`;
    }

    if (
      !endsWithVowel &&
      startsWithVowel &&
      SOFTENING_MAP[baseLast] &&
      !droppedVowel
    ) {
      current = `${current.slice(0, -1)}${SOFTENING_MAP[baseLast]}`;
    }

    current = `${current}${surface}`;
    chainParts.push(surface);
  });

  return {
    surface: current,
    chain: chainParts.join(" + "),
  };
};
