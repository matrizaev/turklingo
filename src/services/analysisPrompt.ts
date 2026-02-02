import { AnalysisOptions } from "../types";

type PromptOptions = {
  enforceJson?: boolean;
};

export function buildAnalysisPrompt(
  options: AnalysisOptions,
  promptOptions: PromptOptions = {},
): string {
  const basePrompt = `You are an expert Turkish linguistics assistant for language learners.
    Analyze the provided Turkish text.

    Key Instructions:
    1. Didactic Meaning: Provide a pedagogical meaning (not just a translation) in 'overview.meaningTarget'. Explain the literal sense and grammatical intent.
    2. Language: Output ALL text in ${options.outputLanguage}.
    3. Feature Canonicalization: Use standard keys in features (tense, person, case, mood, etc.).
    4. Suffixes/Clitics: Treat clitics like '-ki' or the question particle 'mi' as separate tokens or clearly identified bound morphemes.
    5. Beginner Friendly: If 'beginnerFriendly' is true, keep explanations simple and prioritize common usage over obscure terminology.
    6. Vowel Harmony Toggle: If showVowelHarmony is false, return an empty array for vowelHarmony.
    7. IPA Toggle: If showIPA is false, omit pronunciationIpaApprox.
    8. Empty Arrays: If no derivations or inflections exist, return an empty array [].

    Analysis Configuration:
    - Beginner Friendly: ${options.beginnerFriendly}
    - Output Language: ${options.outputLanguage}
    - Detail Level: ${options.detailLevel}
    - Show Vowel Harmony: ${options.showVowelHarmony}
    - Show IPA: ${options.showIPA}
    `;

  if (!promptOptions.enforceJson) {
    return basePrompt;
  }

  return `${basePrompt}
    Output Requirements:
    - Return a single JSON object only.
    - Use double quotes for all keys/strings.
    - Do not wrap the JSON in Markdown or code fences.
    `;
}
