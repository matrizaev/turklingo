import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisOptions, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the exact schema to ensure Type safety from the model
// Note: Type.OBJECT must not be empty. We define common Turkish grammatical features explicitly.
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
        register: { type: Type.STRING, enum: ["formal", "neutral", "informal", "unknown"] },
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
            enum: ["NOUN", "VERB", "ADJ", "ADV", "PRON", "DET", "ADP", "CONJ", "PART", "INTJ", "NUM", "PUNCT", "X"],
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
                        person: { type: Type.STRING, description: "e.g., 1, 2, 3" },
                        number: { type: Type.STRING, description: "e.g., singular, plural" },
                        case: { type: Type.STRING, description: "e.g., nom, acc, dat, loc, abl, gen" },
                        possessive: { type: Type.STRING, description: "e.g., 1s, 2p" },
                        tense: { type: Type.STRING, description: "e.g., past, present, future, aorist" },
                        aspect: { type: Type.STRING, description: "e.g., progressive, perfective" },
                        mood: { type: Type.STRING, description: "e.g., indicative, imperative, optative, conditional" },
                        voice: { type: Type.STRING, description: "e.g., active, passive, causative, reflexive, reciprocal" },
                        polarity: { type: Type.STRING, description: "e.g., positive, negative" }
                      }, 
                      description: "Grammatical features for this specific inflection." 
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
                    rule: { type: Type.STRING, enum: ["two-way", "four-way", "buffer-consonant", "consonant-softening", "other"] },
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

export async function analyzeText(text: string, options: AnalysisOptions): Promise<AnalysisResult> {
  // Using gemini-3-pro-preview for complex linguistic tasks to ensure high accuracy on morphology
  const modelId = "gemini-3-pro-preview"; 

  const systemPrompt = `You are an expert Turkish linguistics assistant. 
  Your task is to analyze Turkish words or sentences and provide a deep morphological breakdown.
  
  Configuration:
  - Beginner Friendly Explanations: ${options.beginnerFriendly}
  - Show Vowel Harmony logic: ${options.showVowelHarmony}
  - Target Output Language for meanings: ${options.outputLanguage}
  - Detail Level: ${options.detailLevel}

  Strictly follow the JSON schema. 
  If the input is not Turkish or invalid, indicate this in 'detected.language' as 'unknown' but try to parse if it looks like Turkish.
  For the 'fullChain', represent the segmentation like "root + suffix + suffix".
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: `Analyze this input: "${text}"`,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
      temperature: 0.1, // Low temperature for consistent linguistic analysis
    },
  });

  if (!response.text) {
    throw new Error("Empty response from AI service.");
  }

  try {
    const data = JSON.parse(response.text);
    return data as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse Gemini response", response.text);
    throw new Error("Invalid JSON response from AI model.");
  }
}