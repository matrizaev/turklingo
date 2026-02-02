import { Schema, Type } from "@google/genai";

const analysisSchemaBase = {
  type: "object",
  additionalProperties: true,
  required: ["input", "detected", "tokens"],
  properties: {
    input: { type: "string" },
    detected: {
      type: "object",
      additionalProperties: true,
      required: ["isSentence", "language"],
      properties: {
        isSentence: { type: "boolean" },
        language: { type: "string", enum: ["tr", "unknown"] },
      },
    },
    overview: {
      type: "object",
      additionalProperties: true,
      properties: {
        meaningEnglish: { type: "string" },
        meaningTurkish: { type: "string" },
        meaningTarget: {
          type: "string",
          description:
            "Didactic meaning (pedagogical paraphrase) in the requested language.",
        },
        register: {
          type: "string",
          enum: ["formal", "neutral", "informal", "unknown"],
        },
        sentenceNotes: { type: "array", items: { type: "string" } },
      },
    },
    tokens: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: true,
        required: ["surface", "pos", "morphology"],
        properties: {
          surface: { type: "string" },
          lemma: { type: "string" },
          pos: {
            type: "string",
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
            type: "object",
            additionalProperties: true,
            required: ["root"],
            properties: {
              root: { type: "string" },
              derivation: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  required: ["type", "affix", "explanation"],
                  properties: {
                    type: { type: "string" },
                    affix: { type: "string" },
                    explanation: { type: "string" },
                  },
                },
              },
              inflection: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  required: ["category", "affix", "explanation"],
                  properties: {
                    category: { type: "string" },
                    affix: { type: "string" },
                    features: {
                      type: "object",
                      additionalProperties: true,
                      properties: {
                        person: { type: "string" },
                        number: { type: "string" },
                        case: { type: "string" },
                        possessive: { type: "string" },
                        tense: { type: "string" },
                        aspect: { type: "string" },
                        mood: { type: "string" },
                        voice: { type: "string" },
                        polarity: { type: "string" },
                        evidentiality: { type: "string" },
                      },
                    },
                    explanation: { type: "string" },
                  },
                },
              },
              fullChain: { type: "string" },
              vowelHarmony: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  required: ["rule", "explanation", "appliesTo"],
                  properties: {
                    rule: {
                      type: "string",
                      enum: [
                        "two-way",
                        "four-way",
                        "buffer-consonant",
                        "consonant-softening",
                        "other",
                      ],
                    },
                    explanation: { type: "string" },
                    appliesTo: { type: "string" },
                  },
                },
              },
              pronunciationIpaApprox: { type: "string" },
            },
          },
          gloss: { type: "string" },
          notes: { type: "array", items: { type: "string" } },
        },
      },
    },
    rulesAndNotes: { type: "array", items: { type: "string" } },
    commonMistakes: { type: "array", items: { type: "string" } },
  },
} as const;

type JsonSchema = typeof analysisSchemaBase;

const typeMap = {
  object: Type.OBJECT,
  array: Type.ARRAY,
  string: Type.STRING,
  boolean: Type.BOOLEAN,
} as const;

function toGeminiSchema(schema: any): Schema {
  const mappedType = typeMap[schema.type as keyof typeof typeMap];

  if (schema.type === "object") {
    const properties = schema.properties
      ? Object.fromEntries(
          Object.entries(schema.properties).map(([key, value]) => [
            key,
            toGeminiSchema(value),
          ]),
        )
      : undefined;

    return {
      type: mappedType,
      properties,
      required: schema.required,
    };
  }

  if (schema.type === "array") {
    return {
      type: mappedType,
      items: schema.items ? toGeminiSchema(schema.items) : undefined,
    };
  }

  return {
    type: mappedType,
    enum: schema.enum,
    description: schema.description,
  };
}

export const openAiAnalysisSchema: JsonSchema = analysisSchemaBase;
export const geminiAnalysisSchema: Schema = toGeminiSchema(analysisSchemaBase);
