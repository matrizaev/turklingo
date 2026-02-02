import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisOptions, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    input: { type: Type.STRING },
    detected: {
      type: Type.OBJECT,
      properties: {
        isSentence: { type: Type.BOOLEAN },
        language: { type: Type.STRING, enum: ["tr", "unknown"] },
      },
      required: ["isSentence", "language"],
    },
    overview: {
      type: Type.OBJECT,
      properties: {
        meaningEnglish: { type: Type.STRING },
        meaningTurkish: { type: Type.STRING },
        meaningTarget: {
          type: Type.STRING,
          description:
            "Didactic meaning (pedagogical paraphrase) in the requested language.",
        },
        register: {
          type: Type.STRING,
          enum: ["formal", "neutral", "informal", "unknown"],
        },
        sentenceNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: [],
    },
    tokens: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          surface: { type: Type.STRING },
          lemma: { type: Type.STRING },
          pos: {
            type: Type.STRING,
            enum: [
              "NOUN",
              "VERB",
              "ADJ",
              "ADV",
              "PRON",
              "DET",
              "ADP",
              "CONJ",
              "PART",
              "INTJ",
              "NUM",
              "PUNCT",
              "X",
            ],
          },
          morphology: {
            type: Type.OBJECT,
            properties: {
              root: { type: Type.STRING },
              derivation: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING },
                    affix: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                  },
                  required: ["type", "affix", "explanation"],
                },
              },
              inflection: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    affix: { type: Type.STRING },
                    features: {
                      type: Type.OBJECT,
                      properties: {
                        person: { type: Type.STRING },
                        number: { type: Type.STRING },
                        case: { type: Type.STRING },
                        possessive: { type: Type.STRING },
                        tense: { type: Type.STRING },
                        aspect: { type: Type.STRING },
                        mood: { type: Type.STRING },
                        voice: { type: Type.STRING },
                        polarity: { type: Type.STRING },
                        evidentiality: { type: Type.STRING },
                      },
                    },
                    explanation: { type: Type.STRING },
                  },
                  required: ["category", "affix", "explanation"],
                },
              },
              fullChain: { type: Type.STRING },
              vowelHarmony: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    rule: {
                      type: Type.STRING,
                      enum: [
                        "two-way",
                        "four-way",
                        "buffer-consonant",
                        "consonant-softening",
                        "other",
                      ],
                    },
                    explanation: { type: Type.STRING },
                    appliesTo: { type: Type.STRING },
                  },
                  required: ["rule", "explanation", "appliesTo"],
                },
              },
              pronunciationIpaApprox: { type: Type.STRING },
            },
            required: ["root"],
          },
          gloss: { type: Type.STRING },
          notes: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["surface", "pos", "morphology"],
      },
    },
    rulesAndNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
    commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["input", "detected", "tokens"],
};

export async function analyzeText(
  text: string,
  options: AnalysisOptions,
): Promise<AnalysisResult> {
  const modelId = "gemini-3-pro-preview";

  const systemPrompt = `You are an expert Turkish linguistics assistant for language learners.
    Analyze the provided Turkish text.

    Key Instructions:
    1. Didactic Meaning: Provide a pedagogical meaning (not just a translation) in 'overview.meaningTarget'. Explain the literal sense and grammatical intent.
    2. Language: Output ALL text in ${options.outputLanguage}.
    3. Feature Canonicalization: Use standard keys in features (tense, person, case, mood, etc.).
    4. Suffixes/Clitics: Treat clitics like '-ki' or the question particle 'mi' as separate tokens or clearly identified bound morphemes.
    5. Beginner Friendly: If 'beginnerFriendly' is true, keep explanations simple and prioritize common usage over obscure terminology.
    6. Empty Arrays: If no derivations or inflections exist, return an empty array [].

    Analysis Configuration:
    - Beginner Friendly: ${options.beginnerFriendly}
    - Output Language: ${options.outputLanguage}
    - Detail Level: ${options.detailLevel}
    `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: `Analyze this input: "${text}"`,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
      temperature: 0.1,
    },
  });

  if (!response.text) throw new Error("Empty response from AI service.");

  try {
    return JSON.parse(response.text) as AnalysisResult;
  } catch (e) {
    throw new Error("Invalid JSON response from AI model.");
  }
}
